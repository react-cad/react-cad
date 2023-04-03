#include "ProgressIndicator.hpp"

#include <Message.hxx>
#include <emscripten.h>

#define IsComplete(x) ((x) > 0.9999999999)
#define ONE_PERCENT 0.01

// clang-format off
EM_JS(emscripten::EM_VAL, jsGetProgress, (), {
  let promiseResolve;
  let promiseReject;
  const progressObject = new Promise(function(resolve, reject) {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  progressObject["fulfilled"] = false;
  progressObject["subscribers"] = [];
  const fulfill = (fn) => (...args) => {
    progressObject["fulfilled"] = true;
    progressObject["subscribers"].length = 0;
    fn(...args);
  };
  progressObject["resolve"] = fulfill(promiseResolve);
  progressObject["reject"] = fulfill(promiseReject);

  let lastProgress;
  let lastMessage;
  progressObject["subscribe"] = (fn) => {
    if (progressObject["fulfilled"]) {
      return;
    }
    if (lastProgress !== undefined) {
      fn(lastProgress, lastMessage);
    }
    progressObject["subscribers"].push(fn);
  };
  progressObject["unsubscribe"] = (fn) => {
    const index = progressObject["subscribers"].indexOf(fn);
    if (index > -1) {
      progressObject["subscribers"].splice(index, 1);
    }
  };
  progressObject["notify"] = (progress, message) => {
    if (progressObject["fulfilled"]) {
      return;
    }

    lastProgress = progress;
    lastMessage = message;

    progressObject["subscribers"].forEach(fn => fn(progress, message));
  };
  progressObject["cancel"] = () => {
    if (!progressObject["fulfilled"]) {
      progressObject.reject("Cancelled");
    }
  };

  return Emval.toHandle(progressObject);
});
// clang-format on

ProgressIndicator::ProgressIndicator(Standard_Boolean resolveWhenComplete)
    : m_last_progress(0), m_cancelled(Standard_False), m_last_name(nullptr),
      m_resolve_when_complete(resolveWhenComplete)
{
  m_js_progress = emscripten::val::take_ownership(jsGetProgress());
}

emscripten::ProxyingQueue ProgressIndicator::deletion_queue;
const pthread_t ProgressIndicator::main_thread = pthread_self();

// Always destroy object on the main thread, where emscripten::val can be deallocated
void ProgressIndicator::Delete() const
{
  const ProgressIndicator *indicator = this;
  if (pthread_self() == main_thread)
  {
    delete indicator;
  }
  else
  {
    deletion_queue.proxySync(main_thread, [=]() { delete indicator; });
  }
}

void ProgressIndicator::Reset()
{
  m_last_progress = 0;
  m_last_name = nullptr;
}

Standard_Boolean ProgressIndicator::UserBreak()
{
  return m_cancelled;
}

void ProgressIndicator::Show(const Message_ProgressScope &theScope, const Standard_Boolean isForce)
{
  Standard_Real progress = GetPosition();

  Standard_CString name = theScope.Name();

  if (/* forced */ isForce || /* first update */ IsEqual(m_last_progress, (Standard_Real)0) ||
      /* last update */ IsComplete(progress) ||
      /* progressed 1% */ progress - m_last_progress > ONE_PERCENT || /* message changed */ name != m_last_name)
  {
    // clang-format off
    MAIN_THREAD_EM_ASM(
        {
          try {
            const progressObject = Emval.toValue($0);
            let name = "";
            try {
              name = $1 == 0 ? "" : UTF8ToString($1);
            } catch (e) {
            }
            const progress = $2;
            const resolveWhenComplete = $3;

            progressObject["notify"](progress, name);

            if (resolveWhenComplete && progress > 0.9999999999) {
              progressObject["resolve"]();
            }
          } catch (e) {
            // progressObject probably deleted before the async function ran
          }
        },
        m_js_progress.as_handle(), name, progress, m_resolve_when_complete);
    // clang-format on
  }

  m_last_progress = progress;
  m_last_name = name;
}

void ProgressIndicator::Abort(const std::string &reason, const std::string &route)
{
  m_cancelled = true;

  Standard_CString reason_str = reason.c_str();
  Standard_CString route_str = route.c_str();

  // clang-format off
  MAIN_THREAD_EM_ASM(
    {
      try {
        const progressObject = Emval.toValue($0);
        const reason = UTF8ToString($1);
        const route = UTF8ToString($2);
        const error = new Error(reason);
        error.route = route;
        progressObject["reject"](error);
      } catch (e) {
        // progressObject probably deleted before the async function ran
      }
    },
    m_js_progress.as_handle(), reason_str, route_str
  );
  // clang-format on
}

void ProgressIndicator::subscribe(emscripten::val fn)
{
  m_js_progress.call<void>("subscribe", fn);
}

void ProgressIndicator::unsubscribe(emscripten::val fn)
{
  m_js_progress.call<void>("unsubscribe", fn);
}

emscripten::val ProgressIndicator::then(emscripten::val thenFn)
{
  return m_js_progress.call<emscripten::val>("then", thenFn);
}

emscripten::val ProgressIndicator::thenCatch(emscripten::val thenFn, emscripten::val catchFn)
{
  return m_js_progress.call<emscripten::val>("then", thenFn, catchFn);
}

emscripten::val ProgressIndicator::catchError(emscripten::val catchFn)
{
  return m_js_progress.call<emscripten::val>("catch", catchFn);
}

emscripten::val ProgressIndicator::isFulfilled()
{
  return m_js_progress["fulfilled"];
}

void ProgressIndicator::cancel()
{
  if (!m_cancelled)
  {
    m_cancelled = true;
    m_js_progress.call<void>("cancel");
  }
}

void ProgressIndicator::resolve(emscripten::val result)
{
  m_js_progress.call<void>("resolve", result);
}
