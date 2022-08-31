#include "RotationNode.hpp"

RotationNode::RotationNode() : m_props({.axis = "z", .angle = 0})
{
}

RotationNode::~RotationNode()
{
}

void RotationNode::setProps(const RotationProps &props)
{
  if (props.axis != m_props.axis || !doubleEquals(props.angle, m_props.angle))
  {
    m_props = props;

    if (m_props.axis == "x")
    {
      m_transform.SetRotation(gp::OX(), m_props.angle);
    }
    if (m_props.axis == "y")
    {
      m_transform.SetRotation(gp::OY(), m_props.angle);
    }
    if (m_props.axis == "z")
    {
      m_transform.SetRotation(gp::OZ(), m_props.angle);
    }

    propsChanged();
  }
}
