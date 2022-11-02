#ifndef PerformanceTimer_HeaderFile
#define PerformanceTimer_HeaderFile

#include <chrono>
#include <string>

class PerformanceTimer
{
public:
  PerformanceTimer(std::string name);
  ~PerformanceTimer();
  void end();

private:
  std::string name;
  std::chrono::time_point<std::chrono::high_resolution_clock> startTime;
  std::chrono::time_point<std::chrono::high_resolution_clock> endTime;
  bool ended;
};

#endif
