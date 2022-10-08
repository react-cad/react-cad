#ifndef SVGTools_Headerfile
#define SVGTools_Headerfile

#include <NCollection_List.hxx>
#include <Standard_Handle.hxx>
#include <TopoDS_Compound.hxx>
#include <TopoDS_Wire.hxx>

#include "SVGImage.hpp"

class SVGBuilder
{
public:
  SVGBuilder(const Handle(SVGImage) & image);

  TopoDS_Shape Shape();

private:
  TopoDS_Shape m_shape;
  Handle(SVGImage) m_image;
};

#endif
