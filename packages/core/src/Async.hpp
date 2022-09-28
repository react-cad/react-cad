#ifndef Async_HeaderFile
#define Async_HeaderFile

#include <condition_variable>
#include <emscripten/eventloop.h>
#include <emscripten/proxying.h>
#include <emscripten/val.h>
#include <iostream>
#include <sched.h>

class Async
{
public:
  Async();
  emscripten::val Perform(std::function<void()> &&func);

private:
  static uint32_t NextID();

  std::thread m_thread;
  emscripten::ProxyingQueue m_queue;
  uint32_t m_queue_id;
  uint32_t m_promise_id;
};

#endif
