#include "Async.hpp"
#include "EmJS.hpp"

#include <Message.hxx>

void thread_func()
{
  emscripten_exit_with_live_runtime();
}

int Async::NextID()
{
  static int id = 0;
  return ++id;
}

Async::Async() : m_thread(thread_func), m_queue(), m_queue_id(NextID()), m_promise_id(0)
{
}

emscripten::val Async::Perform(std::function<void()> &&func)
{
  ++m_promise_id;

  int queueID = m_queue_id;
  int promiseID = m_promise_id;

  emscripten::val promise = EmJS::getPromise(queueID, promiseID);

  int result = m_queue.proxyAsync(m_thread.native_handle(), [=]() {
    func();
    EmJS::resolvePromise(queueID, promiseID);
  });

  return promise;
}

emscripten::val Async::GenerateFile(const std::string &filename, std::function<void()> &&func)
{
  ++m_promise_id;

  int queueID = m_queue_id;
  int promiseID = m_promise_id;

  emscripten::val promise = EmJS::getPromise(queueID, promiseID);

  int result = m_queue.proxyAsync(m_thread.native_handle(), [=]() {
    func();
    EmJS::resolvePromiseWithFileContents(queueID, promiseID, filename);
  });

  return promise;
}
