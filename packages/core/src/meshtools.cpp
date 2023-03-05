#include "meshtools.hpp"

#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeSolid.hxx>
#include <BRepBuilderAPI_MakeVertex.hxx>
#include <BRepBuilderAPI_Sewing.hxx>
#include <BRepLib.hxx>
#include <BRep_Builder.hxx>
#include <Precision.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Compound.hxx>
#include <TopoDS_Face.hxx>
#include <TopoDS_Shell.hxx>
#include <TopoDS_Solid.hxx>
#include <TopoDS_Vertex.hxx>
#include <TopoDS_Wire.hxx>

#include <string>

bool shapeFromMesh(Handle(Poly_Triangulation) aMesh, TopoDS_Shape &shape, const ProgressHandler &handler)
{
  shape = TopoDS_Shape();
  if (aMesh.IsNull())
  {
    return false;
  }

  Message_ProgressScope scope(handler, "Building shape from mesh", 9);

  Message_ProgressScope meshScope(scope.Next(4), "Making faces from triangles ", aMesh->NbTriangles());

  TopoDS_Vertex aTriVertexes[3];
  TopoDS_Face aFace;
  TopoDS_Wire aWire;
  BRepBuilderAPI_Sewing aSewingTool;
  aSewingTool.Init(Precision::Approximation(), Standard_True);

  TopoDS_Compound aComp;
  BRep_Builder BuildTool;
  BuildTool.MakeCompound(aComp);

  for (Standard_Integer aTriIdx = 1; aTriIdx <= aMesh->NbTriangles() && meshScope.More(); ++aTriIdx)
  {
    const Poly_Triangle &aTriangle = aMesh->Triangle(aTriIdx);

    Standard_Integer anId[3];
    aTriangle.Get(anId[0], anId[1], anId[2]);

    const gp_Pnt &aPnt1 = aMesh->Node(anId[0]);
    const gp_Pnt &aPnt2 = aMesh->Node(anId[1]);
    const gp_Pnt &aPnt3 = aMesh->Node(anId[2]);
    if ((!(aPnt1.IsEqual(aPnt2, 0.0))) && (!(aPnt1.IsEqual(aPnt3, 0.0))))
    {
      aTriVertexes[0] = BRepBuilderAPI_MakeVertex(aPnt1);
      aTriVertexes[1] = BRepBuilderAPI_MakeVertex(aPnt2);
      aTriVertexes[2] = BRepBuilderAPI_MakeVertex(aPnt3);

      aWire = BRepBuilderAPI_MakePolygon(aTriVertexes[0], aTriVertexes[1], aTriVertexes[2], Standard_True);
      if (!aWire.IsNull())
      {
        aFace = BRepBuilderAPI_MakeFace(aWire);
        if (!aFace.IsNull())
        {
          BuildTool.Add(aComp, aFace);
        }
      }
    }

    meshScope.Next();
  }

  if (!scope.More())
  {
    return true;
  }

  aSewingTool.Load(aComp);
  aSewingTool.Perform(scope.Next(4));

  TopoDS_Shape theShape = aSewingTool.SewedShape();

  if (theShape.ShapeType() == TopAbs_SHELL)
  {
    TopoDS_Shell shell = TopoDS::Shell(theShape);
    BRepBuilderAPI_MakeSolid makeSolid;
    makeSolid.Add(shell);
    makeSolid.Build();
    if (makeSolid.IsDone())
    {
      TopoDS_Solid solid = makeSolid.Solid();
      BRepLib::OrientClosedSolid(solid);
      shape = solid;
      return true;
    }
  }

  return false;
}
