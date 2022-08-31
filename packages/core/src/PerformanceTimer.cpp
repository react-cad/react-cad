#include "PerformanceTimer.hpp"

#include <chrono>
#include <string>

#include <Message.hxx>
#include <Message_Messenger.hxx>

PerformanceTimer::PerformanceTimer(std::string name) : name(name){};

void PerformanceTimer::start()
{
  startTime = std::chrono::high_resolution_clock::now();
}

void PerformanceTimer::end()
{
  endTime = std::chrono::high_resolution_clock::now();

  auto millis = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);

  std::stringstream message;
  message << name << ": " << millis.count() << "ms";

  Message::DefaultMessenger()->Send(TCollection_AsciiString(message.str().c_str()), Message_Trace);
}
