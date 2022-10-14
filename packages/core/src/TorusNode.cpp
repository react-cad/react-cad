#include <BRepPrimAPI_MakeTorus.hxx>

#include "TorusNode.hpp"

TorusNode::TorusNode() : m_radius1(1), m_radius2(1), m_angle(0)
{
}

void TorusNode::setSize(Standard_Real radius1, Standard_Real radius2)
{
  if (!IsEqual(m_radius1, radius1) || !IsEqual(m_radius2, radius2))
  {
    m_radius1 = radius1;
    m_radius2 = radius2;
    propsChanged();
  }
}
void TorusNode::setAngle(Standard_Real angle)
{
  if (!IsEqual(m_angle, angle))
  {
    m_angle = angle;
    propsChanged();
  }
}

void TorusNode::computeShape(const Message_ProgressRange &theRange)
{
  double angle = fmin(fmax(m_angle, 0), 2 * M_PI);

  TopoDS_Solid torus;

  if (m_angle == 0)
  {
    torus = BRepPrimAPI_MakeTorus(m_radius1, m_radius2);
  }
  else
  {
    torus = BRepPrimAPI_MakeTorus(m_radius1, m_radius2, angle);
  }

  shape = torus;
}
