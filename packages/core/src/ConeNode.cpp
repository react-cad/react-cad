#include <BRepPrimAPI_MakeCone.hxx>

#include "ConeNode.hpp"

ConeNode::ConeNode() : m_props({.center = false, .radius1 = 1, .radius2 = 1, .height = 1, .angle = 0})
{
}

void ConeNode::setProps(const ConeProps &props)
{
  if (!props.center == m_props.center || !IsEqual(props.radius1, m_props.radius1) ||
      !IsEqual(props.radius2, m_props.radius2) || !IsEqual(props.height, m_props.height) ||
      !IsEqual(props.angle, m_props.angle))
  {
    m_props = props;
    propsChanged();
  }
}

void ConeNode::computeShape()
{
  TopoDS_Solid cone;

  if (m_props.angle == 0)
  {
    cone = BRepPrimAPI_MakeCone(m_props.radius1, m_props.radius2, m_props.height);
  }
  else
  {
    Standard_Real a = fmin(fmax(m_props.angle, 0), 2 * M_PI);
    cone = BRepPrimAPI_MakeCone(m_props.radius1, m_props.radius2, m_props.height, a);
  }

  if (m_props.center)
  {
    gp_Trsf translation;
    translation.SetTranslation(gp_Vec(0, 0, -m_props.height / 2));
    cone.Move(translation);
  }

  shape = cone;
}
