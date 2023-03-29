#include <BRepBuilderAPI_MakeSolid.hxx>
#include <BRepBuilderAPI_Sewing.hxx>
#include <BRepLib.hxx>
#include <ShapeFix_Shell.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Shell.hxx>
#include <TopoDS_Solid.hxx>

#include "SolidNode.hpp"

SolidNode::SolidNode(){};

void SolidNode::computeShape(const ProgressHandler &handler)
{
  Message_ProgressScope scope(handler, "Computing solid", 1);

  BRepBuilderAPI_Sewing solid;
  solid.SetTolerance(1e-4);

  TopExp_Explorer Faces;
  int nbFaces = 0;
  for (Faces.Init(m_childShape, TopAbs_FACE); Faces.More(); Faces.Next())
  {
    solid.Add(Faces.Current());
  }
  solid.Perform(scope.Next());

  TopoDS_Shape sewedShape = solid.SewedShape();

  if (sewedShape.ShapeType() != TopAbs_SHELL)
  {
    handler.Abort("solid: could not make shell from faces");
    return;
  }

  ShapeFix_Shell fixShell(TopoDS::Shell(sewedShape));
  fixShell.Perform(handler.WithRange(scope.Next()));
  TopoDS_Shell shell = fixShell.Shell();

  BRepBuilderAPI_MakeSolid makeSolid;
  makeSolid.Add(shell);
  makeSolid.Build();

  if (!makeSolid.IsDone())
  {
    handler.Abort("solid: could not make solid from shell");
    return;
  }

  TopoDS_Solid shape = makeSolid.Solid();
  BRepLib::OrientClosedSolid(shape);
  setShape(shape);
}
