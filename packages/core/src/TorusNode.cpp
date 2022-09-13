#include <BRepPrimAPI_MakeTorus.hxx>

#include "TorusNode.hpp"

TorusNode::TorusNode() : m_props({.radius1 = 1, .radius2 = 1, .angle = 0})
{
}

TorusNode::~TorusNode()
{
}

void TorusNode::setProps(const TorusProps &props)
{
  if (!doubleEquals(m_props.radius1, props.radius1) || !doubleEquals(m_props.radius2, props.radius2) ||
      !doubleEquals(m_props.angle, props.angle))
  {
    m_props = props;
    propsChanged();
  }
}

void TorusNode::computeShape()
{
  double angle = fmin(fmax(m_props.angle, 0), 2 * M_PI);

  TopoDS_Shell torus;

  if (m_props.angle == 0)
  {
    torus = BRepPrimAPI_MakeTorus(m_props.radius1, m_props.radius2);
  }
  else
  {
    torus = BRepPrimAPI_MakeTorus(m_props.radius1, m_props.radius2, angle);
  }

  shape = torus;
}
