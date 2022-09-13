#include <BRepPrimAPI_MakeCylinder.hxx>

#include "CylinderNode.hpp"

CylinderNode::CylinderNode() : m_props({.center = false, .radius = 1, .height = 1, .angle = 0})
{
}

CylinderNode::~CylinderNode()
{
}

void CylinderNode::setProps(const CylinderProps &props)
{
  if (!props.center == m_props.center || !doubleEquals(props.radius, m_props.radius) ||
      !doubleEquals(props.height, m_props.height) || !doubleEquals(props.angle, m_props.angle))
  {
    m_props = props;
    propsChanged();
  }
}

void CylinderNode::computeShape()
{
  TopoDS_Shape cylinder;

  if (m_props.angle == 0)
  {
    cylinder = BRepPrimAPI_MakeCylinder(m_props.radius, m_props.height);
  }
  else
  {
    Standard_Real a = fmin(fmax(m_props.angle, 0), 2 * M_PI);
    cylinder = BRepPrimAPI_MakeCylinder(m_props.radius, m_props.height, a);
  }

  if (m_props.center)
  {
    gp_Trsf translation;
    translation.SetTranslation(gp_Vec(0, 0, -m_props.height / 2));
    cylinder.Move(translation);
  }
  shape = cylinder;
}
