#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepPrimAPI_MakePrism.hxx>

#include "PrismNode.hpp"

PrismNode::PrismNode() : m_props({.axis = "z", .height = 1})
{
}

PrismNode::~PrismNode()
{
}

void PrismNode::setProps(const PrismProps &props)
{
  if (props.axis != m_props.axis || !doubleEquals(props.height, m_props.height))
  {
    m_props = props;

    propsChanged();
  }
}

void PrismNode::computeShape()
{
  gp_Vec axis;

  if (m_props.axis == "x")
  {
    axis.SetX(m_props.height);
  }
  if (m_props.axis == "y")
  {
    axis.SetY(m_props.height);
  }
  if (m_props.axis == "z")
  {
    axis.SetZ(m_props.height);
  }

  BRepBuilderAPI_MakeFace profile(m_profile);
  BRepPrimAPI_MakePrism prism(profile, axis);

  shape = prism.Shape();
}
