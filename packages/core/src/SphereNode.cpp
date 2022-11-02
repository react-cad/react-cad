#include <BRepPrimAPI_MakeSphere.hxx>

#include "SphereNode.hpp"

SphereNode::SphereNode() : m_radius(1), m_angle(0), m_segmentAngle1(0), m_segmentAngle2(0)
{
}

void SphereNode::setRadius(Standard_Real radius)
{
  if (!IsEqual(radius, m_radius))
  {
    m_radius = radius;
    propsChanged();
  }
}

void SphereNode::setAngle(Standard_Real angle)
{
  if (!IsEqual(angle, m_angle))
  {
    m_angle = angle;
    propsChanged();
  }
}

void SphereNode::setSegment(Standard_Real angle1, Standard_Real angle2)
{
  if (!IsEqual(angle1, m_segmentAngle1) || !IsEqual(angle2, m_segmentAngle2))
  {
    m_segmentAngle1 = angle1;
    m_segmentAngle2 = angle2;
    propsChanged();
  }
}

bool SphereNode::computeShape(const Message_ProgressRange &theRange)
{
  shape = TopoDS_Shape();

  double angle = fmin(fmax(m_angle, 0), 2 * M_PI);

  BRepPrimAPI_MakeSphere makeSphere(1, 1, 1);

  if (m_segmentAngle1 == 0 && m_segmentAngle2 == 0)
  {
    if (m_angle == 0)
    {
      makeSphere = BRepPrimAPI_MakeSphere(m_radius);
    }
    else
    {
      makeSphere = BRepPrimAPI_MakeSphere(m_radius, angle);
    }
  }
  else
  {
    double segmentAngle1 = fmin(fmax(m_segmentAngle1, -M_PI_2), M_PI_2);
    double segmentAngle2 = fmin(fmax(m_segmentAngle2, -M_PI_2), segmentAngle1);

    if (m_angle == 0)
    {
      makeSphere = BRepPrimAPI_MakeSphere(m_radius, segmentAngle2, segmentAngle1);
    }
    else
    {

      makeSphere = BRepPrimAPI_MakeSphere(m_radius, segmentAngle2, segmentAngle1, angle);
    }
  }

  makeSphere.Build(/*theRange*/);
  if (!makeSphere.IsDone())
  {
    addError("Could not construct sphere");
    return false;
  }

  shape = makeSphere.Solid();
  return true;
}
