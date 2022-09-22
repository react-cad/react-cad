#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <GCE2d_MakeSegment.hxx>
#include <Geom_CylindricalSurface.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <gp_Lin2d.hxx>

#include <math.h>

#include "HelixNode.hpp"

#include "PerformanceTimer.hpp"
#include "operations.hpp"

HelixNode::HelixNode() : m_pitch(10), m_height(10)
{
}

HelixNode::~HelixNode()
{
}

void HelixNode::setPitch(Standard_Real pitch)
{
  if (!IsEqual(pitch, m_pitch))
  {
    m_pitch = pitch;
    propsChanged();
  }
}

void HelixNode::setHeight(Standard_Real height)
{
  if (!IsEqual(height, m_height))
  {
    m_height = height;
    propsChanged();
  }
}

void HelixNode::buildSpineAndGuide()
{
  BRepBuilderAPI_MakeEdge edge(gp_Pnt(0, 0, 0), gp_Pnt(0, 0, m_height));
  BRepBuilderAPI_MakeWire makeSpine(edge);
  m_spine = makeSpine;

  Standard_Real radius = 1.0;
  Standard_Real circumference = 2 * M_PI * radius;
  Standard_Real length = m_height * sqrt((m_pitch * m_pitch) + (circumference * circumference));

  gp_Lin2d aLine2d(gp_Pnt2d(0.0, 0.0), gp_Dir2d(circumference, m_pitch));
  Handle_Geom2d_TrimmedCurve aSegment = GCE2d_MakeSegment(aLine2d, 0.0, length);

  Handle_Geom_CylindricalSurface aCylinder = new Geom_CylindricalSurface(gp::XOY(), radius);
  TopoDS_Edge aHelixEdge = BRepBuilderAPI_MakeEdge(aSegment, aCylinder, 0.0, length);
  BRepLib::BuildCurve3d(aHelixEdge);

  BRepBuilderAPI_MakeWire makeGuide(aHelixEdge);
  m_guide = makeGuide;
}

TopoDS_Shape HelixNode::makeHelix(const TopoDS_Wire &profile)
{
  BRepOffsetAPI_MakePipeShell pipe(m_spine);
  pipe.SetMode(m_guide, false);
  pipe.Add(profile);

  pipe.Build();
  pipe.MakeSolid();

  return pipe;
}

void HelixNode::computeShape()
{
  PerformanceTimer timer("Calculate helix");
  buildSpineAndGuide();

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Faces;
  for (Faces.Init(m_profile, TopAbs_FACE); Faces.More(); Faces.Next())
  {
    TopoDS_Face face = TopoDS::Face(Faces.Current());
    TopoDS_Wire outerWire = BRepTools::OuterWire(face);

    TopoDS_Shape solid = makeHelix(outerWire);

    TopTools_ListOfShape holes;

    TopExp_Explorer Wires;
    for (Wires.Init(face, TopAbs_WIRE); Wires.More(); Wires.Next())
    {
      TopoDS_Wire wire = TopoDS::Wire(Wires.Current());
      if (wire.IsEqual(outerWire))
      {
        continue;
      }
      holes.Append(makeHelix(wire));
    }

    TopoDS_Shape helix = differenceOp(solid, holes);
    builder.Add(compound, helix);
  }

  shape = compound;
  timer.end();
}
