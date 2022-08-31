#include <BRepPrimAPI_MakeSphere.hxx>

#include "SphereNode.hpp"

SphereNode::SphereNode() : m_props({.radius = 1})
{
}

SphereNode::~SphereNode()
{
}

void SphereNode::setProps(const SphereProps &props)
{
  if (!doubleEquals(props.radius, m_props.radius))
  {
    m_props = props;
    propsChanged();
  }
}

void SphereNode::renderShape()
{
  BRepPrimAPI_MakeSphere sphere(m_props.radius);
  shape = sphere.Solid();
}
