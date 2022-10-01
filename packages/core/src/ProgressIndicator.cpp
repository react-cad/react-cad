#include "ProgressIndicator.hpp"

#include <emscripten.h>

// clang-format off
EM_JS(emscripten::EM_VAL, jsGetProgress, (), {
  let promiseResolve;
  let promiseReject;
  const progressObject = new Promise(function(resolve, reject) {
    promiseResolve = resolve;
    promiseReject = reject;
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
  progressObject.notify = (progress) => {
    progressObject.subscribers.forEach(fn => fn(progress));
  };
  progressObject.cancel = () => {
    progressObject.subscribers.length = 0;
  };

  return Emval.toHandle(progressObject);
});
// clang-format on

int ProgressIndicator::NextID()
{
  static int id = 0;
  return ++id;
}

ProgressIndicator::ProgressIndicator() : m_progress_id(NextID()), m_cancelled(Standard_False)
{
  m_js_progress = emscripten::val::take_ownership(jsGetProgress());
}

ProgressIndicator::~ProgressIndicator()
{
  // emscripten::val destructor crashes if called off the main thread since it isn't defined there

  // Do the real destruction on the main thread
  // clang-format off
  MAIN_THREAD_EM_ASM({
    __emval_decref($0);
  }, m_js_progress.as_handle());
  // clang-format on

  // Create a dummy reference on this thread so the destructor thinks it worked
  // This will corrupt emscripten::vals on the calling thread, but we don't have any
  // clang-format off
  EM_ASM({
    emval_handle_array[$0] = {
      refcount: 1
    };
  }, m_js_progress.as_handle());
  // clang-format on
}

Standard_Boolean ProgressIndicator::UserBreak()
{
  return m_cancelled;
}

void ProgressIndicator::Show(const Message_ProgressScope &theScope, const Standard_Boolean isForce)
{
  Standard_Real progress = GetPosition();
  // clang-format off
  MAIN_THREAD_ASYNC_EM_ASM(
      {
        const progressObject = Emval.toValue($0);
        progressObject.notify($1);
        if ($1 == 1)
        {
          progressObject.resolve()
        }
      },
      m_js_progress.as_handle(), progress);
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
