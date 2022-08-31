#include <BRepPrimAPI_MakeTorus.hxx>

#include "TorusNode.hpp"

TorusNode::TorusNode() : m_props({.radius1 = 1, .radius2 = 1})
{
}

TorusNode::~TorusNode()
{
}

void TorusNode::setProps(const TorusProps &props)
{
  if (!doubleEquals(m_props.radius1, props.radius1) || !doubleEquals(m_props.radius2, props.radius2))
  {
    m_props = props;
    propsChanged();
  }
}

void TorusNode::renderShape()
{
  BRepPrimAPI_MakeTorus torus(m_props.radius1, m_props.radius2);
  shape = torus.Solid();
}
