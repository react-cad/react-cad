#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <GCE2d_MakeSegment.hxx>
#include <Geom_CylindricalSurface.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <gp_Lin2d.hxx>

#include <math.h>

#include "HelixNode.hpp"

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

void HelixNode::renderShape()
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
  pipe.Add(m_profile);
  pipe.Build();
  pipe.MakeSolid();

  shape = pipe.Shape();
}
