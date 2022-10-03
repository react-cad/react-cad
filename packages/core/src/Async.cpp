#include "Async.hpp"
#include "EmJS.hpp"

#include <Message.hxx>

void thread_func()
{
  emscripten_exit_with_live_runtime();
}

std::thread thread(thread_func);
emscripten::ProxyingQueue queue;
int promise_id = 0;

Handle(ProgressIndicator) Async::Perform(std::function<void(const Message_ProgressRange &)> &&func)
{
  Handle(ProgressIndicator) progress = new ProgressIndicator();
  queue.proxyAsync(thread.native_handle(), [=]() { func(ProgressIndicator::Start(progress)); });
  return progress;
}

emscripten::val Async::GenerateFile(const std::string &filename, std::function<void()> &&func)
{
  ++promise_id;

  int id = promise_id;

  emscripten::val promise = EmJS::getPromise(id);

  int result = queue.proxyAsync(thread.native_handle(), [=]() {
    func();
    EmJS::resolvePromiseWithFileContents(id, filename);
  });

  return promise;
}
