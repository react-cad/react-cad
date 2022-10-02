#include "ProgressIndicator.hpp"

#include <emscripten.h>

// clang-format off
EM_JS(emscripten::EM_VAL, jsGetProgress, (), {
  let fulfilled = false;
  let promiseResolve;
  let promiseReject;
  const progressObject = new Promise(function(resolve, reject) {
    promiseResolve = function() { fulfilled = true; resolve() };
    promiseReject = function() { fulfilled = true; reject(); };
  });
  progressObject.resolve = promiseResolve;
  progressObject.reject = promiseReject;
  progressObject.subscribers = [];
  progressObject.subscribe = (fn) => {
    progressObject.subscribers.push(fn);
  };
  progressObject.unsubscribe = (fn) => {
    const index = progressObject.subscribers.indexOf(fn);
    if (index > -1) {
      progressObject.subscribers.splice(index, 1);
    }
  };
  progressObject.notify = (...args) => {
    progressObject.subscribers.forEach(fn => fn(...args));
  };
  progressObject.cancel = () => {
    progressObject.subscribers.length = 0;
    if (!fulfilled) {
      progressObject.reject("Cancelled");
    }
  };

  return Emval.toHandle(progressObject);
});
// clang-format on

int ProgressIndicator::NextID()
{
  static int id = 0;
  return ++id;
}

ProgressIndicator::ProgressIndicator() : m_progress_id(NextID()), m_last_progress(0), m_cancelled(Standard_False)
{
  m_js_progress = emscripten::val::take_ownership(jsGetProgress());
}

void ProgressIndicator::Reset()
{
  m_last_progress = 0;
}

Standard_Boolean ProgressIndicator::UserBreak()
{
  return m_cancelled;
}

void ProgressIndicator::Show(const Message_ProgressScope &theScope, const Standard_Boolean isForce)
{
  Standard_Real progress = GetPosition();

  if (progress - m_last_progress > 0.01)
  {
    Standard_CString name = theScope.Name();

    // clang-format off
    MAIN_THREAD_ASYNC_EM_ASM(
        {
          const progressObject = Emval.toValue($0);
          const name = $1 == 0 ? undefined : UTF8ToString($1);
          const progress = $2;

          progressObject.notify(progress, name);

          if (progress > 0.9999999999)
          {
            progressObject.resolve()
          }
        },
        m_js_progress.as_handle(), name, progress);
    // clang-format on
  }

  m_last_progress = progress;
}

void ProgressIndicator::subscribe(emscripten::val fn)
{
  m_js_progress.call<void>("subscribe", fn);
}

void ProgressIndicator::unsubscribe(emscripten::val fn)
{
  m_js_progress.call<void>("unsubscribe", fn);
}

void ProgressIndicator::then(emscripten::val thenFn)
{
  m_js_progress.call<void>("then", thenFn);
}

void ProgressIndicator::thenCatch(emscripten::val thenFn, emscripten::val catchFn)
{
  m_js_progress.call<void>("then", thenFn, catchFn);
}

void ProgressIndicator::catchError(emscripten::val catchFn)
{
  m_js_progress.call<void>("catch", catchFn);
}

void ProgressIndicator::cancel()
{
  m_cancelled = true;
  m_js_progress.call<void>("cancel");
}
