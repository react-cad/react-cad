#include <BRepPrimAPI_MakeCylinder.hxx>

#include "CylinderNode.hpp"

CylinderNode::CylinderNode() : m_props({.center = false, .radius = 1, .height = 1})
{
}

CylinderNode::~CylinderNode()
{
}

void CylinderNode::setProps(const CylinderProps &props)
{
  if (!props.center == m_props.center || !doubleEquals(props.radius, m_props.radius) ||
      !doubleEquals(props.height, m_props.height))
  {
    m_props = props;
    propsChanged();
  }
}

void CylinderNode::renderShape()
{
  TopoDS_Shape cylinder = BRepPrimAPI_MakeCylinder(m_props.radius, m_props.height).Solid();
  if (m_props.center)
  {
    gp_Trsf translation;
    translation.SetTranslation(gp_Vec(0, 0, -m_props.height / 2));
    cylinder.Move(translation);
  }
  shape = cylinder;
}
