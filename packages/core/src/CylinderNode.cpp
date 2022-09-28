#include <BRepPrimAPI_MakeCylinder.hxx>

#include "CylinderNode.hpp"

CylinderNode::CylinderNode() : m_centered(Standard_False), m_radius(1), m_height(1), m_angle(0)
{
}

void CylinderNode::setSize(Standard_Real radius, Standard_Real height)
{
  if (!IsEqual(radius, m_radius) || !IsEqual(height, m_height))
  {
    m_radius = radius;
    m_height = height;
    propsChanged();
  }
}

void CylinderNode::setAngle(Standard_Real angle)
{
  if (!IsEqual(angle, m_angle))
  {
    m_angle = angle;
    propsChanged();
  }
}

void CylinderNode::setCentered(Standard_Boolean centered)
{
  if (centered != m_centered)
  {
    m_centered = centered;
    propsChanged();
  }
}

void CylinderNode::computeShape()
{
  TopoDS_Solid cylinder;

  if (m_angle == 0)
  {
    cylinder = BRepPrimAPI_MakeCylinder(m_radius, m_height);
  }
  else
  {
    Standard_Real a = fmin(fmax(m_angle, 0), 2 * M_PI);
    cylinder = BRepPrimAPI_MakeCylinder(m_radius, m_height, a);
  }

  if (m_centered)
  {
    gp_Trsf translation;
    translation.SetTranslation(gp_Vec(0, 0, -m_height / 2));
    cylinder.Move(translation);
  }
  shape = cylinder;
}
