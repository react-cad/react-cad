#ifndef Async_HeaderFile
#define Async_HeaderFile

#include <emscripten/eventloop.h>
#include <emscripten/proxying.h>
#include <emscripten/val.h>
#include <pthread.h>
#include <string>

#include "ProgressIndicator.hpp"

class Async
{
public:
  static Handle(ProgressIndicator) Perform(std::function<void(const Message_ProgressRange &progressRange)> &&func);
  static Handle(ProgressIndicator)
      GenerateFile(const std::string &filename, std::function<void(const Message_ProgressRange &progressRange)> &&func);

private:
  static void thread_function();
  static pthread_t main_thread;
  static std::thread worker_thread;
  static emscripten::ProxyingQueue worker_queue;
};

#endif
