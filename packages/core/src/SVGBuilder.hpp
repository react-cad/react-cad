#ifndef SVGTools_Headerfile
#define SVGTools_Headerfile

#include <NCollection_List.hxx>
#include <Standard_Handle.hxx>
#include <TopoDS_Compound.hxx>
#include <TopoDS_Wire.hxx>

#include "SVGImage.hpp"

typedef NCollection_List<TopoDS_Compound> SVGBuilder_ListOfShapes;

class SVGBuilder
{
public:
  SVGBuilder(const Handle(SVGImage) & image);

  TopoDS_Compound Shape();

private:
  TopoDS_Compound m_compound;
  Handle(SVGImage) m_image;
};

#endif
