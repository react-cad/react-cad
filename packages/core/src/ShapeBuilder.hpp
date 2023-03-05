#ifndef ShapeBuilder_Headerfile
#define ShapeBuilder_Headerfile

#include <Message_ProgressRange.hxx>
#include <Standard_Handle.hxx>
#include <TopoDS_Shape.hxx>

#include "ProgressHandler.hpp"

class ShapeBuilder : public Standard_Transient
{
public:
  virtual void Build(const ProgressHandler &handler) = 0;
  bool IsDone()
  {
    return m_done;
  }
  virtual TopoDS_Shape Shape(const ProgressHandler &handler) = 0;
  ~ShapeBuilder() override{};

protected:
  bool m_done = false;
};

#endif
