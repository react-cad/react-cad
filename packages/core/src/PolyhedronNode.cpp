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

const Point defaultPoints[4] = {
    {.x = 1, .y = 0, .z = 0},
    {.x = 0, .y = 1, .z = 0},
    {.x = 0, .y = 0, .z = 1},
};

const unsigned int faces[4][3] = {
    {0, 1, 2},
    {0, 1, 3},
    {0, 2, 3},
    {1, 2, 3},
};

const NCollection_Array1<int> defaultFaces[4] = {
    NCollection_Array1<int>(faces[0][0], 0, 2),
    NCollection_Array1<int>(faces[1][0], 0, 2),
    NCollection_Array1<int>(faces[2][0], 0, 2),
    NCollection_Array1<int>(faces[3][0], 0, 2),
};

PolyhedronNode::PolyhedronNode()
{
  m_points = NCollection_Array1<Point>(defaultPoints[0], 0, 3);

  m_faces = NCollection_Array1<NCollection_Array1<int>>(defaultFaces[0], 0, 3);
}

bool PolyhedronNode::checkFaces(const NCollection_Array1<NCollection_Array1<int>> &faces)
{
  if (faces.Size() < 4)
  {
    return false;
  }

  for (auto face = m_faces.begin(); face != m_faces.end(); ++face)
  {
    if (face->Size() < 3)
    {
      return false;
    }

    for (auto pointIndex = face->begin(); pointIndex != face->end(); ++pointIndex)
    {
      if (*pointIndex < 0 || *pointIndex >= m_points.Size())
      {
        return false;
      }
    }
  }

  return true;
}

void PolyhedronNode::setPointsAndFaces(const NCollection_Array1<Point> &points,
                                       const NCollection_Array1<NCollection_Array1<int>> &faces)
{
  lock();
  m_points = NCollection_Array1<Point>(points);
  if (checkFaces(faces))
  {
    m_faces = NCollection_Array1<NCollection_Array1<int>>(faces);
  }
  else
  {
    m_faces = NCollection_Array1<NCollection_Array1<int>>();
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
      Point point = m_points[*pointIndex];
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
