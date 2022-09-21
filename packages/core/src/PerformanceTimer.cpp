#include "PerformanceTimer.hpp"

#include <chrono>
#include <string>

#include <Message.hxx>

PerformanceTimer::PerformanceTimer(std::string name) : name(name)
{
  startTime = std::chrono::high_resolution_clock::now();
  std::stringstream message;
  message << name << " start";
  Message::DefaultMessenger()->Send(message, Message_Trace);
};

void PerformanceTimer::end()
{
  endTime = std::chrono::high_resolution_clock::now();

  auto millis = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);

  std::stringstream message;
  message << name << " end: " << millis.count() << "ms";

  Message::DefaultMessenger()->Send(message, Message_Trace);
}
