#include "Async.hpp"

#include <Message.hxx>

void thread_func()
{
  emscripten_exit_with_live_runtime();
}

EM_JS(emscripten::EM_VAL, getPromise, (int queueID, int promiseID), {
  const promiseObject = {};
  promiseObject.promise = new Promise(function(resolve, reject) {
    promiseObject.resolve = resolve;
    promiseObject.reject = reject;
  });

  const g = typeof global == "undefined" ? window : global;

  g["ReactCADAsync"] = g["ReactCADAsync"] || {};
  g["ReactCADAsync"][queueID] = g["ReactCADAsync"][queueID] || {};
  g["ReactCADAsync"][queueID][promiseID] = promiseObject;

  return Emval.toHandle(promiseObject);
});

uint32_t Async::NextID()
{
  static uint32_t id = 0;
  return ++id;
}

Async::Async() : m_thread(thread_func), m_queue(), m_queue_id(NextID()), m_promise_id(0)
{
}

emscripten::val Async::Perform(std::function<void()> &&func)
{
  ++m_promise_id;

  emscripten::val promiseObject = emscripten::val::take_ownership(getPromise(m_queue_id, m_promise_id));

  uint32_t queueID = m_queue_id;
  uint32_t promiseID = m_promise_id;

  int result = m_queue.proxyAsync(m_thread.native_handle(), [=]() {
    func();

    MAIN_THREAD_EM_ASM(
        {
          const g = typeof global == "undefined" ? window : global;
          const promise = g["ReactCADAsync"][$0][$1];
          delete g["ReactCADAsync"][$0][$1];
          promise.resolve();
        },
        queueID, promiseID);
  });

  return promiseObject["promise"];
}
