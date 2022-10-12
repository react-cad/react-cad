#include "PolygonBuilder.hpp"

#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>

PolygonBuilder::PolygonBuilder(const NCollection_Array1<gp_Pnt> &points, Standard_Boolean closed)
    : m_closed(closed), m_shape(), m_points(points){};

TopoDS_Shape PolygonBuilder::Shape(const Message_ProgressRange &theRange)
{
  if (!m_shape.IsNull())
  {
    return m_shape;
  }

  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : m_points)
  {
    polygon.Add(point);
  }
  if (m_closed)
  {
    polygon.Close();
  }

  BRepBuilderAPI_MakeFace face(polygon.Wire());
  return face;
}
