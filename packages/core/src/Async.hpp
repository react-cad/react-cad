#ifndef Async_HeaderFile
#define Async_HeaderFile

#include <condition_variable>
#include <emscripten/eventloop.h>
#include <emscripten/proxying.h>
#include <emscripten/val.h>
#include <iostream>
#include <string>

class Async
{
public:
  static emscripten::val Perform(std::function<void()> &&func);
  static emscripten::val GenerateFile(const std::string &filename, std::function<void()> &&func);

private:
  std::thread m_thread;
  emscripten::ProxyingQueue m_queue;
  int m_promise_id;
};

#endif
