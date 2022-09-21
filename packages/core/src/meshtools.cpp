#include "meshtools.hpp"

#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeSolid.hxx>
#include <BRepBuilderAPI_MakeVertex.hxx>
#include <BRepBuilderAPI_Sewing.hxx>
#include <BRepLib.hxx>
#include <BRep_Builder.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Compound.hxx>
#include <TopoDS_Face.hxx>
#include <TopoDS_Shell.hxx>
#include <TopoDS_Solid.hxx>
#include <TopoDS_Vertex.hxx>
#include <TopoDS_Wire.hxx>

#include <string>

TopoDS_Shape shapeFromMesh(Handle(Poly_Triangulation) aMesh)
{
  if (aMesh.IsNull())
  {
    return TopoDS_Shape();
  }

  TopoDS_Vertex aTriVertexes[3];
  TopoDS_Face aFace;
  TopoDS_Wire aWire;
  BRepBuilderAPI_Sewing aSewingTool;
  aSewingTool.Init(1.0e-06, Standard_True);

  TopoDS_Compound aComp;
  BRep_Builder BuildTool;
  BuildTool.MakeCompound(aComp);

  const TColgp_Array1OfPnt &aNodes = aMesh->Nodes();
  const Poly_Array1OfTriangle &aTriangles = aMesh->Triangles();
  for (Standard_Integer aTriIdx = aTriangles.Lower(); aTriIdx <= aTriangles.Upper(); ++aTriIdx)
  {
    const Poly_Triangle &aTriangle = aTriangles(aTriIdx);

    Standard_Integer anId[3];
    aTriangle.Get(anId[0], anId[1], anId[2]);

    const gp_Pnt &aPnt1 = aNodes(anId[0]);
    const gp_Pnt &aPnt2 = aNodes(anId[1]);
    const gp_Pnt &aPnt3 = aNodes(anId[2]);
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
  }

  aSewingTool.Load(aComp);
  aSewingTool.Perform();

  TopoDS_Shape theShape = aSewingTool.SewedShape();

  if (theShape.ShapeType() == TopAbs_SHELL)
  {
    TopoDS_Shell shell = TopoDS::Shell(theShape);
    BRepBuilderAPI_MakeSolid makeSolid;
    makeSolid.Add(shell);
    makeSolid.Build();
    TopoDS_Solid solid = makeSolid.Solid();
    BRepLib::OrientClosedSolid(solid);

    return solid;
  }

  return TopoDS_Shape();
}
