#include "ProgressIndicator.hpp"

#include <emscripten.h>

// clang-format off
EM_JS(emscripten::EM_VAL, jsGetProgress, (), {
  let fulfilled = false;
  let cancelled = false;
  let promiseResolve;
  let promiseReject;
  const progressObject = new Promise(function(resolve, reject) {
    promiseResolve = resolve;
    promiseReject = reject;
  });
  progressObject.resolve = promiseResolve;
  progressObject.reject = promiseReject;
  progressObject.subscribers = [];
  let lastProgress;
  let lastMessage;
  progressObject.subscribe = (fn) => {
    if (fulfilled || cancelled) {
      return;
    }
    if (lastProgress !== undefined) {
      fn(lastProgress, lastMessage);
    }
    progressObject.subscribers.push(fn);
  };
  progressObject.unsubscribe = (fn) => {
    const index = progressObject.subscribers.indexOf(fn);
    if (index > -1) {
      progressObject.subscribers.splice(index, 1);
    }
  };
  progressObject.notify = (progress, message) => {
    if (fulfilled || cancelled) {
      return;
    }

    lastProgress = progress;
    lastMessage = message;

    progressObject.subscribers.forEach(fn => fn(progress, message));

    if (progress > 0.9999999999) {
      progressObject.resolve();
      progressObject.subscribers.length = 0;
      fulfilled = true;
    }
  };
  progressObject.cancel = () => {
    if (!fulfilled && !cancelled) {
      progressObject.notify(lastProgress, "Cancelling");
      progressObject.reject();
      progressObject.subscribers.length = 0;
      cancelled = true;
      fulfilled = true;
    }
  };

  return Emval.toHandle(progressObject);
});
// clang-format on

ProgressIndicator::ProgressIndicator() : m_last_progress(0), m_cancelled(Standard_False), m_last_name(nullptr)
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
      /* last update */ progress > 0.9999999999 ||
      /* progressed 1% */ progress - m_last_progress > 0.01 || /* message changed */ name != m_last_name)
  {
    // clang-format off
    MAIN_THREAD_ASYNC_EM_ASM(
        {
          const progressObject = Emval.toValue($0);
          let name = "";
          try {
            name = $1 == 0 ? "" : UTF8ToString($1);
          } catch (e) {
          }
          const progress = $2;

          progressObject.notify(progress, name);
        },
        m_js_progress.as_handle(), name, progress);
    // clang-format on
  }

  m_last_progress = progress;
  m_last_name = name;
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

void ProgressIndicator::cancel()
{
  m_cancelled = true;
  m_js_progress.call<void>("cancel");
}
