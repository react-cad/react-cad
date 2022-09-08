#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepPrimAPI_MakeRevol.hxx>

#include <math.h>

#include "RevolutionNode.hpp"

RevolutionNode::RevolutionNode() : m_props({.axis = "z", .angle = 2 * M_PI})
{
}

RevolutionNode::~RevolutionNode()
{
}

void RevolutionNode::setProps(const RevolutionProps &props)
{
  if (props.axis != m_props.axis || !doubleEquals(props.angle, m_props.angle))
  {
    m_props = props;
    propsChanged();
  }
}

void RevolutionNode::computeShape()
{
  gp_Ax1 axis;

  if (m_props.axis == "x")
  {
    axis = gp::OX();
  }
  if (m_props.axis == "y")
  {
    axis = gp::OY();
  }
  if (m_props.axis == "z")
  {
    axis = gp::OZ();
  }

  double angle = fmin(m_props.angle, 2 * M_PI);

  BRepBuilderAPI_MakeFace profile(m_profile);
  BRepPrimAPI_MakeRevol revolution(profile, axis, angle);

  shape = revolution.Shape();
}
