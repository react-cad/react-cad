#ifndef ProgressRange_HeaderFile
#define ProgressRange_HeaderFile

#include "ProgressIndicator.hpp"
#include <Message_ProgressRange.hxx>
#include <NCollection_Array1.hxx>
#include <Standard_Transient.hxx>
#include <string>

class ProgressHandler : public Standard_Transient
{
public:
  ProgressHandler(Handle(ProgressIndicator) progressIndicator, Message_ProgressRange progressRange)
      : m_progressIndicator(progressIndicator), m_progressRange(progressRange){};

  operator Message_ProgressRange() const
  {
    return m_progressRange;
  };

  ProgressHandler WithRange(Message_ProgressRange progressRange) const
  {
    return ProgressHandler(m_progressIndicator, progressRange, m_name);
  }
  ProgressHandler WithRangeAndName(Message_ProgressRange progressRange, const std::string &name) const
  {
    return ProgressHandler(m_progressIndicator, progressRange, name);
  }

  void Abort(std::string reason) const
  {
    m_progressIndicator->Abort(reason, m_name);
  }

  std::string Name() const
  {
    return m_name;
  };

private:
  ProgressHandler(Handle(ProgressIndicator) progressIndicator, Message_ProgressRange progressRange,
                  const std::string &name)
      : m_progressIndicator(progressIndicator), m_progressRange(progressRange), m_name(name){};

  Handle(ProgressIndicator) m_progressIndicator;
  Message_ProgressRange m_progressRange;
  std::string m_name;
};

#endif
