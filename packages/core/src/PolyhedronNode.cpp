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
  m_points = NCollection_Array1<gp_Pnt>(0, 3);
  m_points[0] = gp_Pnt(0, 0, 0);
  m_points[1] = gp_Pnt(1, 0, 0);
  m_points[2] = gp_Pnt(0, 1, 0);
  m_points[3] = gp_Pnt(0, 0, 1);

  m_faces = NCollection_Array1<NCollection_Array1<int>>(0, 3);
  m_faces[0] = NCollection_Array1<int>(0, 2);
  m_faces[0][0] = 0;
  m_faces[0][1] = 1;
  m_faces[0][2] = 2;
  m_faces[1] = NCollection_Array1<int>(0, 2);
  m_faces[1][0] = 0;
  m_faces[1][1] = 1;
  m_faces[1][2] = 3;
  m_faces[2] = NCollection_Array1<int>(0, 2);
  m_faces[2][0] = 0;
  m_faces[2][1] = 2;
  m_faces[2][2] = 3;
  m_faces[3] = NCollection_Array1<int>(0, 2);
  m_faces[3][0] = 1;
  m_faces[3][1] = 2;
  m_faces[3][2] = 3;
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

void PolyhedronNode::setPointsAndFaces(const NCollection_Array1<gp_Pnt> &points,
                                       const NCollection_Array1<NCollection_Array1<int>> &faces)
{
  m_points = points;
  if (checkFaces(faces))
  {
    m_faces = faces;
  }
  else
  {
    m_faces = NCollection_Array1<NCollection_Array1<int>>();
  }
  propsChanged();
}

bool PolyhedronNode::computeShape(const Message_ProgressRange &theRange)
{
  shape = TopoDS_Shape();

  BRepBuilderAPI_Sewing polyhedron;

  Message_ProgressScope scope(theRange, "Computing polyhedron", 9);

  Message_ProgressScope meshScope(scope.Next(4), "Building faces", m_faces.Size());

  int faceId = -1;
  for (auto face = m_faces.begin(); face != m_faces.end() && meshScope.More(); ++face)
  {
    ++faceId;
    BRepBuilderAPI_MakePolygon polygon;
    for (auto pointIndex = face->begin(); pointIndex != face->end(); ++pointIndex)
    {
      gp_Pnt point = m_points[*pointIndex];
      polygon.Add(point);
    }
    polygon.Close();
    BRepBuilderAPI_MakeFace f(polygon.Wire());
    if (!f.IsDone())
    {
      addError("Could not make face " + std::to_string(faceId));
      return false;
    }
    polyhedron.Add(f);

    meshScope.Next();
  }

  if (!scope.More())
  {
    return true;
  }

  polyhedron.Perform(scope.Next(4));
  TopoDS_Shape sewedShape = polyhedron.SewedShape();

  if (!scope.More())
  {
    return true;
  }

  if (sewedShape.ShapeType() != TopAbs_SHELL)
  {
    addError("Could not make shell from faces");
    return false;
  }

  TopoDS_Shell shell = TopoDS::Shell(sewedShape);
  BRepBuilderAPI_MakeSolid makeSolid;
  makeSolid.Add(shell);
  makeSolid.Build();

  if (!makeSolid.IsDone())
  {
    addError("Could not make solid from shell");
    return false;
  }

  TopoDS_Solid solid = makeSolid.Solid();
  BRepLib::OrientClosedSolid(solid);
  shape = solid;
  return true;
}
