#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeSolid.hxx>
#include <BRepBuilderAPI_Sewing.hxx>
#include <BRepLib.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Shell.hxx>
#include <TopoDS_Solid.hxx>
#include <gp_Pnt.hxx>

#include "PolyhedronNode.hpp"

PolyhedronNode::PolyhedronNode()
{
  m_points = std::vector<Point>({
      {.x = 0, .y = 0, .z = 0},
      {.x = 1, .y = 0, .z = 0},
      {.x = 0, .y = 1, .z = 0},
      {.x = 0, .y = 0, .z = 1},
  });

  m_faces = std::vector<std::vector<unsigned int>>({
      {0, 1, 2},
      {0, 1, 3},
      {0, 2, 3},
      {1, 2, 3},
  });
}

bool PolyhedronNode::checkFaces(const std::vector<std::vector<unsigned int>> &faces)
{
  if (faces.size() < 4)
  {
    return false;
  }

  for (auto face = m_faces.begin(); face != m_faces.end(); ++face)
  {
    if (face->size() < 3)
    {
      return false;
    }

    for (auto pointIndex = face->begin(); pointIndex != face->end(); ++pointIndex)
    {
      if (*pointIndex < 0 || *pointIndex >= m_points.size())
      {
        return false;
      }
    }
  }

  return true;
}

void PolyhedronNode::setPointsAndFaces(const std::vector<Point> &points,
                                       const std::vector<std::vector<unsigned int>> &faces)
{
  lock();
  m_points = std::vector<Point>(points);
  if (checkFaces(faces))
  {
    m_faces = std::vector<std::vector<unsigned int>>(faces);
  }
  else
  {
    m_faces = std::vector<std::vector<unsigned int>>();
  }
  propsChanged();
  unlock();
}

void PolyhedronNode::computeShape()
{
  BRepBuilderAPI_Sewing polyhedron;

  for (auto face = m_faces.begin(); face != m_faces.end(); ++face)
  {
    BRepBuilderAPI_MakePolygon polygon;
    for (auto pointIndex = face->begin(); pointIndex != face->end(); ++pointIndex)
    {
      Point point = m_points.at(*pointIndex);
      polygon.Add(gp_Pnt(point.x, point.y, point.z));
    }
    polygon.Close();
    BRepBuilderAPI_MakeFace f(polygon.Wire());
    if (!f.IsDone())
    {
      shape = TopoDS_Shape();
      return;
    }
    polyhedron.Add(f);
  }

  polyhedron.Perform();
  TopoDS_Shape sewedShape = polyhedron.SewedShape();

  if (sewedShape.ShapeType() == TopAbs_SHELL)
  {
    TopoDS_Shell shell = TopoDS::Shell(sewedShape);
    BRepBuilderAPI_MakeSolid makeSolid;
    makeSolid.Add(shell);
    makeSolid.Build();
    TopoDS_Solid solid = makeSolid.Solid();
    BRepLib::OrientClosedSolid(solid);
    shape = solid;
  }
  else
  {
    shape = TopoDS_Shape();
  }
}
