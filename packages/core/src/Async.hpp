#ifndef Async_HeaderFile
#define Async_HeaderFile

#include <emscripten/eventloop.h>
#include <emscripten/proxying.h>
#include <emscripten/val.h>
#include <string>

#include "ProgressIndicator.hpp"

class Async
{
public:
  static emscripten::val Perform(std::function<void()> &&func);
  static Handle(ProgressIndicator)
      PerformWithProgress(std::function<void(const Message_ProgressRange &progressRange)> &&func);
  static emscripten::val GenerateFile(const std::string &filename, std::function<void()> &&func);

private:
  std::thread m_thread;
  emscripten::ProxyingQueue m_queue;
  int m_promise_id;
};

#endif
