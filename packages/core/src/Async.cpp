#include "Async.hpp"
#include "EmJS.hpp"

#include <Message.hxx>

void Async::thread_function()
{
  emscripten_exit_with_live_runtime();
}

pthread_t Async::main_thread(pthread_self());
std::thread Async::worker_thread(thread_function);
emscripten::ProxyingQueue Async::worker_queue;

Handle(ProgressIndicator) Async::Perform(std::function<void(const Message_ProgressRange &)> &&func)
{
  Handle(ProgressIndicator) progress = new ProgressIndicator();
  worker_queue.proxyAsync(worker_thread.native_handle(), [=]() { func(ProgressIndicator::Start(progress)); });
  return progress;
}

Handle(ProgressIndicator) Async::GenerateFile(const std::string &filename,
                                              std::function<void(const Message_ProgressRange &progressRange)> &&func)
{
  std::string myFilename(filename);
  Handle(ProgressIndicator) progress = new ProgressIndicator(Standard_False);
  int result = worker_queue.proxyAsync(worker_thread.native_handle(), [=]() {
    func(ProgressIndicator::Start(progress));
    worker_queue.proxyAsync(main_thread, [=]() { progress->resolve(EmJS::getFileContentsAndDelete(myFilename)); });
  });
  return progress;
}
