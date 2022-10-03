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

#include "PerformanceTimer.hpp"
#include "SVGImage.hpp"
#include "operations.hpp"

PipeNode::PipeNode() : m_spine()
{
}

void PipeNode::setSpine(const NCollection_Array1<gp_Pnt> &points)
{
  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : points)
  {
    TopoDS_Vertex vertex = BRepBuilderAPI_MakeVertex(point);
    polygon.Add(vertex);
  }
  m_spine = polygon;
  propsChanged();
}

void PipeNode::setSpineSVG(const std::string &pathData)
{
  SVGImage image = SVGImage::FromPathData(pathData);

  Handle(Geom_Plane) xzPlane = new Geom_Plane(gp_Ax3(gp::Origin(), -gp::DY(), gp::DX()));

  auto shape = image.begin();
  if (shape != image.end())
  {
    auto path = shape.begin();
    if (path != shape.end())
    {
      BRepBuilderAPI_MakeWire makeWire;

      for (auto curve = path.begin(); curve != path.end(); ++curve)
      {
        Handle(Geom2d_Curve) c = curve;
        if (!c.IsNull())
        {
          c->Translate(gp_Vec2d(0, image.Height()));
          BRepBuilderAPI_MakeEdge edge(c, xzPlane);
          makeWire.Add(edge);
        }
      }

      TopoDS_Wire suspiciousWire = makeWire;

      BRepLib::BuildCurves3d(suspiciousWire);

      ShapeFix_Wire fixWire;
      fixWire.SetSurface(xzPlane);
      fixWire.Load(suspiciousWire);
      fixWire.Perform();

      TopoDS_Wire wire = fixWire.Wire();
      wire.Orientation(TopAbs_REVERSED);

      m_spine = wire;

      propsChanged();
    }
  }
}

TopoDS_Shape PipeNode::makePipe(const TopoDS_Wire &profile)
{
  BRepOffsetAPI_MakePipeShell pipe(m_spine);
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
  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Faces;
  int nbFaces = 0;
  for (Faces.Init(m_profile, TopAbs_FACE); Faces.More(); Faces.Next())
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

    Message_ProgressScope faceScope(scope.Next(), "Computing pipe component", nbWires + 2);

    TopoDS_Wire outerWire = BRepTools::OuterWire(face);
    TopoDS_Shape solid = makePipe(outerWire);

    faceScope.Next();

    TopTools_ListOfShape holes;

    for (Wires.ReInit(); Wires.More() && faceScope.More(); Wires.Next())
    {
      TopoDS_Wire wire = TopoDS::Wire(Wires.Current());
      if (wire.IsEqual(outerWire))
      {
        continue;
      }
      holes.Append(makePipe(wire));
      faceScope.Next();
    }

    TopoDS_Shape pipe = differenceOp(solid, holes);
    builder.Add(compound, pipe);
    faceScope.Next(2);
  }

  shape = compound;
#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
