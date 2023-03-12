#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeVertex.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <Geom_Plane.hxx>
#include <ShapeFix_Wire.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <TopoDS_Shape.hxx>

#include "PipeNode.hpp"

#include "BooleanOperation.hpp"
#include "PerformanceTimer.hpp"
#include "SVGPathBuilder.hpp"

PipeNode::PipeNode() : m_spineBuilder()
{
  setSpine("M 0 0 L 0 -1");
}

void PipeNode::setSpine(const std::string &pathData)
{
  Handle(Geom_Plane) xzPlane = new Geom_Plane(gp_Ax3(gp::Origin(), -gp::DY(), gp::DX()));
  m_spineBuilder = new SVGPathBuilder(pathData, xzPlane);
  propsChanged();
}

bool PipeNode::makePipe(const TopoDS_Shape &profile, const TopoDS_Shape &spine, TopoDS_Shape &shape)
{
  TopoDS_Wire wire = TopoDS::Wire(spine);
  BRepOffsetAPI_MakePipeShell pipe(wire);
  // TODO: Expose homothety to user?
  pipe.Add(profile);

  pipe.Build();
  if (pipe.IsDone())
  {
    pipe.MakeSolid();
    shape = pipe.Shape();
    return true;
  }

  shape = TopoDS_Shape();
  return false;
}

void PipeNode::computeShape(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate pipe");
#endif
  shape = TopoDS_Shape();

  TopoDS_Shape spine = m_spineBuilder->Shape(handler);

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Faces;
  int nbFaces = 0;
  for (Faces.Init(m_childShape, TopAbs_FACE); Faces.More(); Faces.Next())
  {
    ++nbFaces;
  }

  Message_ProgressScope scope(handler, "Computing pipe", nbFaces);

  int faceId = -1;
  for (Faces.ReInit(); Faces.More() && scope.More(); Faces.Next())
  {
    ++faceId;
    TopoDS_Face face = TopoDS::Face(Faces.Current());

    TopExp_Explorer Wires;
    int nbWires = 0;
    for (Wires.Init(face, TopAbs_WIRE); Wires.More(); Wires.Next())
    {
      ++nbWires;
    }

    Message_ProgressScope faceScope(scope.Next(), "Computing pipe component", nbWires * 2);

    TopoDS_Wire outerWire = BRepTools::OuterWire(face);
    TopoDS_Shape solid;
    bool solidSuccess = makePipe(outerWire, spine, solid);
    if (!solidSuccess)
    {
      handler.Abort("pipe: could not make pipe for outer wire of face " + std::to_string(faceId));
      continue;
    }

    faceScope.Next();

    TopTools_ListOfShape holes;

    int wireId = -1;
    for (Wires.ReInit(); Wires.More() && faceScope.More(); Wires.Next())
    {
      ++wireId;
      TopoDS_Wire wire = TopoDS::Wire(Wires.Current());
      if (wire.IsEqual(outerWire))
      {
        continue;
      }
      TopoDS_Shape hole;
      bool holeSuccess = makePipe(wire, spine, hole);
      if (holeSuccess)
      {
        holes.Append(hole);
      }
      else
      {
        handler.Abort("pipe: could not make pipe for wire " + std::to_string(wireId) + " of face " +
                      std::to_string(faceId));
        continue;
      }
      faceScope.Next();
    }

    if (faceScope.More())
    {
      BooleanOperation op;
      op.Difference(solid, holes, handler.WithRange(faceScope.Next(nbWires)));
      if (op.HasErrors())
      {
        handler.Abort("pipe: boolean operation failed\n\n" + op.Errors());
      }
      else
      {
        builder.Add(compound, op.Shape());
      }
    }
  }

  if (scope.More())
  {
    shape = compound;
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
