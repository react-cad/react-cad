#include "PolygonBuilder.hpp"

#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>

PolygonBuilder::PolygonBuilder(const NCollection_Array1<gp_Pnt> &points, Standard_Boolean closed)
    : m_closed(closed), m_shape(), m_points(points){};

void PolygonBuilder::Build(const ProgressHandler &handler)
{
  if (m_done)
  {
    return;
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
  m_shape = face;
  m_done = true;
}

TopoDS_Shape PolygonBuilder::Shape(const ProgressHandler &handler)
{
  if (!m_done)
  {
    Build(handler);
  }
  return m_shape;
}
