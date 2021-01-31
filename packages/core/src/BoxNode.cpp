#include <BRepPrimAPI_MakeBox.hxx>
#include <gp_Pnt.hxx>

#include "BoxNode.h"

BoxNode::BoxNode() : m_props({.center = false, .x = 1, .y = 1, .z = 1})
{
}

BoxNode::~BoxNode()
{
}

void BoxNode::setProps(const BoxProps &props)
{
  if (props.center != m_props.center || !doubleEquals(props.x, m_props.x) || !doubleEquals(props.y, m_props.y) ||
      !doubleEquals(props.z, m_props.z))
  {
    m_props = props;
    propsChanged();
  }
}

void BoxNode::renderShape()
{
  if (m_props.center)
  {
    shape =
        BRepPrimAPI_MakeBox(gp_Pnt(-m_props.x / 2, -m_props.y / 2, -m_props.z / 2), m_props.x, m_props.y, m_props.z);
  }
  else
  {
    shape = BRepPrimAPI_MakeBox(m_props.x, m_props.y, m_props.z);
  }
}
