#ifndef ShapeBuilder_Headerfile
#define ShapeBuilder_Headerfile

#include <Message_ProgressRange.hxx>
#include <Standard_Handle.hxx>
#include <TopoDS_Shape.hxx>

class ShapeBuilder : public Standard_Transient
{
public:
  virtual TopoDS_Shape Shape(const Message_ProgressRange &theRange = Message_ProgressRange()) = 0;
  ~ShapeBuilder() override{};
};

#endif
