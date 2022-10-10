#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeVertex.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <Geom_Plane.hxx>
#include <Message.hxx>
#include <ShapeFix_Wire.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <TopoDS_Shape.hxx>

#include "PipeNode.hpp"

#include "PerformanceTimer.hpp"
#include "PolygonBuilder.hpp"
#include "SVGPathBuilder.hpp"
#include "operations.hpp"

PipeNode::PipeNode() : m_spineBuilder()
{
  NCollection_Array1<gp_Pnt> points(0, 1);
  points[0] = gp_Pnt(0, 0, 0);
  points[1] = gp_Pnt(0, 0, 1);
  setSpine(points);
}

void PipeNode::setSpine(const NCollection_Array1<gp_Pnt> &points)
{
  m_spineBuilder = new PolygonBuilder(points, false);
  propsChanged();
}

void PipeNode::setSpineSVG(const std::string &pathData)
{
  Handle(Geom_Plane) xzPlane = new Geom_Plane(gp_Ax3(gp::Origin(), -gp::DY(), gp::DX()));
  m_spineBuilder = new SVGPathBuilder(pathData, xzPlane);
  propsChanged();
}

TopoDS_Shape makePipe(const TopoDS_Shape &profile, const TopoDS_Shape &spine)
{
  Message::DefaultMessenger()->Send(TCollection_AsciiString("is null ") + spine.IsNull());

  TopoDS_Wire wire = TopoDS::Wire(spine);
  BRepOffsetAPI_MakePipeShell pipe(wire);
  // TODO: Expose homothety to user?
  pipe.Add(profile);

  pipe.Build();
  pipe.MakeSolid();

  return pipe;
}

void PipeNode::computeShape(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate pipe");
#endif

  TopoDS_Shape profile = getProfile();
  TopoDS_Shape spine = m_spineBuilder->Shape();

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Faces;
  int nbFaces = 0;
  for (Faces.Init(profile, TopAbs_FACE); Faces.More(); Faces.Next())
  {
    ++nbFaces;
  }

  Message_ProgressScope scope(theRange, "Computing pipe", nbFaces);

  for (Faces.ReInit(); Faces.More() && scope.More(); Faces.Next())
  {
    TopoDS_Face face = TopoDS::Face(Faces.Current());

    TopExp_Explorer Wires;
    int nbWires = 0;
    for (Wires.Init(face, TopAbs_WIRE); Wires.More(); Wires.Next())
    {
      ++nbWires;
    }

    Message_ProgressScope faceScope(scope.Next(), "Computing pipe component", nbWires * 2);

    TopoDS_Wire outerWire = BRepTools::OuterWire(face);
    TopoDS_Shape solid = makePipe(outerWire, spine);

    faceScope.Next();

    TopTools_ListOfShape holes;

    for (Wires.ReInit(); Wires.More() && faceScope.More(); Wires.Next())
    {
      TopoDS_Wire wire = TopoDS::Wire(Wires.Current());
      if (wire.IsEqual(outerWire))
      {
        continue;
      }
      holes.Append(makePipe(wire, spine));
      faceScope.Next();
    }

    TopoDS_Shape pipe = differenceOp(solid, holes, faceScope.Next(nbWires));
    builder.Add(compound, pipe);
  }

  shape = compound;
#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
