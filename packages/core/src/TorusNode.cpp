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

void TorusNode::computeShape(const ProgressHandler &handler)
{
  shape = TopoDS_Shape();

  double angle = fmin(fmax(m_angle, 0), 2 * M_PI);

  BRepPrimAPI_MakeTorus makeTorus(1, 1);

  if (m_angle == 0)
  {
    makeTorus = BRepPrimAPI_MakeTorus(m_radius1, m_radius2);
  }
  else
  {
    makeTorus = BRepPrimAPI_MakeTorus(m_radius1, m_radius2, angle);
  }

  makeTorus.Build(/*theRange*/);
  if (makeTorus.IsDone())
  {
    shape = makeTorus.Solid();
  }
  else
  {
    handler.Abort("torus: construction failed");
  }
}
