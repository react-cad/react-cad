#ifndef PolygonBuilder_HeaderFile
#define PolygonBuilder_HeaderFile

#include "ShapeBuilder.hpp"

#include <NCollection_Array1.hxx>
#include <TopoDS_Shape.hxx>
#include <gp_Pnt.hxx>

class PolygonBuilder : public ShapeBuilder
{
public:
  PolygonBuilder(const NCollection_Array1<gp_Pnt> &points, Standard_Boolean closed);

  TopoDS_Shape Shape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  Standard_Boolean m_closed;
  TopoDS_Shape m_shape;
  NCollection_Array1<gp_Pnt> m_points;
};

#endif
