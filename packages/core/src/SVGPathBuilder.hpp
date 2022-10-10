#ifndef SVGPathBuilder_Headerfile
#define SVGPathBuilder_Headerfile

#include <Geom_Plane.hxx>
#include <NCollection_List.hxx>
#include <Standard_Handle.hxx>
#include <TopoDS_Wire.hxx>
#include <string>

#include "ShapeBuilder.hpp"

class SVGPathBuilder : public ShapeBuilder
{
public:
  SVGPathBuilder(const std::string &pathData, const Handle(Geom_Plane) & plane);
  TopoDS_Shape Shape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  Handle(Geom_Plane) m_plane;
  TopoDS_Shape m_shape;
  std::string m_pathData;
};

#endif
