#include "ScaleNode.hpp"

ScaleNode::ScaleNode() : m_props({.factor = 1})
{
}

ScaleNode::~ScaleNode()
{
}

void ScaleNode::setProps(const ScaleProps &props)
{
  if (!doubleEquals(m_props.factor, props.factor))
  {
    m_props = props;
    m_transform.SetScale(gp_Pnt(0, 0, 0), m_props.factor);
    propsChanged();
  }
}
