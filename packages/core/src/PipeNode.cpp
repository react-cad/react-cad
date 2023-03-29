#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeVertex.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipe.hxx>
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
  gp_Ax3 position(gp::Origin(), -gp::DY(), gp::DX());
  Handle(Geom_Plane) xzPlane = new Geom_Plane(position);
  m_spineBuilder = new SVGPathBuilder(pathData, xzPlane);
  propsChanged();
}

void PipeNode::computeShape(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate pipe");
#endif
  setShape(TopoDS_Shape());

  TopoDS_Shape spine = m_spineBuilder->Shape(handler);

  BRepOffsetAPI_MakePipe pipe(TopoDS::Wire(spine), m_childShape);
  pipe.Build();
  if (pipe.IsDone())
  {
    setShape(pipe.Shape());
    return;
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
