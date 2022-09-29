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
  Async();
  emscripten::val Perform(std::function<void()> &&func);
  emscripten::val GenerateFile(const std::string &filename, std::function<void()> &&func);

private:
  static int NextID();

  std::thread m_thread;
  emscripten::ProxyingQueue m_queue;
  int m_queue_id;
  int m_promise_id;
};

#endif
