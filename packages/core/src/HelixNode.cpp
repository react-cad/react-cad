#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <GCE2d_MakeSegment.hxx>
#include <Geom_CylindricalSurface.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <gp_Lin2d.hxx>

#include <math.h>

#include "HelixNode.hpp"

#include "PerformanceTimer.hpp"
#include "operations.hpp"

HelixNode::HelixNode() : m_props({.pitch = 1, .height = 1})
{
}

HelixNode::~HelixNode()
{
}

void HelixNode::setProps(const HelixProps &props)
{
  if (!doubleEquals(props.pitch, m_props.pitch) || !doubleEquals(props.height, m_props.height))
  {
    m_props = props;
    propsChanged();
  }
}

TopoDS_Shape HelixNode::makeHelix(TopoDS_Wire profile)
{
  BRepBuilderAPI_MakeEdge edge(gp_Pnt(0, 0, 0), gp_Pnt(0, 0, m_props.height));
  BRepBuilderAPI_MakeWire spine(edge);

  Standard_Real radius = 1.0;
  Standard_Real circumference = 2 * M_PI * radius;
  Standard_Real length = m_props.height * sqrt((m_props.pitch * m_props.pitch) + (circumference * circumference));

  gp_Lin2d aLine2d(gp_Pnt2d(0.0, 0.0), gp_Dir2d(circumference, m_props.pitch));
  Handle_Geom2d_TrimmedCurve aSegment = GCE2d_MakeSegment(aLine2d, 0.0, length);

  Handle_Geom_CylindricalSurface aCylinder = new Geom_CylindricalSurface(gp::XOY(), radius);
  TopoDS_Edge aHelixEdge = BRepBuilderAPI_MakeEdge(aSegment, aCylinder, 0.0, length);
  BRepLib::BuildCurve3d(aHelixEdge);

  BRepBuilderAPI_MakeWire guide(aHelixEdge);

  BRepOffsetAPI_MakePipeShell pipe(spine);
  pipe.SetMode(guide, false);
  pipe.Add(profile);

  pipe.Build();
  pipe.MakeSolid();

  return pipe;
}

void HelixNode::computeShape()
{
  makeProfile();

  PerformanceTimer timer("Calculate helix");

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  std::vector<ShapeWires>::iterator it;
  for (it = wires.begin(); it != wires.end(); ++it)
  {
    BRep_Builder positiveBuilder;
    TopoDS_Compound positiveCompound;
    positiveBuilder.MakeCompound(positiveCompound);

    for (std::vector<TopoDS_Wire>::iterator pos = it->first.begin(); pos != it->first.end(); ++pos)
    {
      positiveBuilder.Add(positiveCompound, makeHelix(*pos));
    }

    if (it->second.size() == 0)
    {
      builder.Add(compound, positiveCompound);
    }
    else
    {
      BRep_Builder negativeBuilder;
      TopoDS_Compound negativeCompound;
      negativeBuilder.MakeCompound(negativeCompound);

      for (std::vector<TopoDS_Wire>::iterator neg = it->second.begin(); neg != it->second.end(); ++neg)
      {
        negativeBuilder.Add(negativeCompound, makeHelix(*neg));
      }

      builder.Add(compound, differenceOp(positiveCompound, negativeCompound));
    }
  }
  shape = compound;
  timer.end();
}
