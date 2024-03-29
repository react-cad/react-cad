#include <BRepPrimAPI_MakeCone.hxx>

#include "ConeNode.hpp"

ConeNode::ConeNode() : m_centered(Standard_False), m_radius1(1), m_radius2(1), m_height(1), m_angle(0)
{
}

void ConeNode::setCentered(Standard_Boolean centered)
{
  if (centered != m_centered)
  {
    m_centered = centered;
    propsChanged();
  }
}

void ConeNode::setSize(Standard_Real radius1, Standard_Real radius2, Standard_Real height)
{
  if (!IsEqual(radius1, m_radius1) || !IsEqual(radius2, m_radius2) || !IsEqual(height, m_height))
  {
    m_radius1 = radius1;
    m_radius2 = radius2;
    m_height = height;
    propsChanged();
  }
}

void ConeNode::setAngle(Standard_Real angle)
{
  if (!IsEqual(angle, m_angle))
  {
    m_angle = angle;
    propsChanged();
  }
}

void ConeNode::computeShape(const ProgressHandler &handler)
{
  setShape(TopoDS_Shape());

  TopoDS_Solid cone;

  BRepPrimAPI_MakeCone makeCone(1, 0, 1);

  if (m_angle == 0)
  {
    makeCone = BRepPrimAPI_MakeCone(m_radius1, m_radius2, m_height);
  }
  else
  {
    Standard_Real a = fmin(fmax(m_angle, 0), 2 * M_PI);
    makeCone = BRepPrimAPI_MakeCone(m_radius1, m_radius2, m_height, a);
  }

  makeCone.Build(/*theRange*/);
  if (!makeCone.IsDone())
  {
    handler.Abort("cone: construction failed");
    return;
  }
  cone = makeCone.Solid();

  if (m_centered)
  {
    gp_Trsf translation;
    translation.SetTranslation(gp_Vec(0, 0, -m_height / 2));
    cone.Move(translation);
  }

  setShape(cone);
}
