#include <BRepPrimAPI_MakeBox.hxx>
#include <gp_Pnt.hxx>

#include "BoxNode.hpp"

BoxNode::BoxNode() : m_props({.center = false, .x = 1, .y = 1, .z = 1})
{
}

void BoxNode::setProps(const BoxProps &props)
{
  if (props.center != m_props.center || !IsEqual(props.x, m_props.x) || !IsEqual(props.y, m_props.y) ||
      !IsEqual(props.z, m_props.z))
  {
    m_props = props;
    propsChanged();
  }
}

void BoxNode::computeShape()
{
  TopoDS_Solid box;
  if (m_props.center)
  {
    box = BRepPrimAPI_MakeBox(gp_Pnt(-m_props.x / 2, -m_props.y / 2, -m_props.z / 2), m_props.x, m_props.y, m_props.z);
  }
  else
  {
    box = BRepPrimAPI_MakeBox(m_props.x, m_props.y, m_props.z);
  }
  shape = box;
}
