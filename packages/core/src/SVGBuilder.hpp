#ifndef SVGBuilder_Headerfile
#define SVGBuilder_Headerfile

#include <NCollection_List.hxx>
#include <Standard_Handle.hxx>
#include <TopoDS_Compound.hxx>
#include <TopoDS_Wire.hxx>
#include <string>

#include "ShapeBuilder.hpp"

class SVGBuilder : public ShapeBuilder
{
public:
  SVGBuilder(const std::string &svg);
  TopoDS_Shape Shape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  TopoDS_Shape m_shape;
  std::string m_svg;
};

#endif
