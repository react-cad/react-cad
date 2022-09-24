#include <BRepPrimAPI_MakeSphere.hxx>

#include "SphereNode.hpp"

SphereNode::SphereNode() : m_props({.radius = 1, .angle = 0, .segmentAngle1 = 0, .segmentAngle2 = 0})
{
}

void SphereNode::setProps(const SphereProps &props)
{
  if (!IsEqual(props.radius, m_props.radius) || !IsEqual(props.angle, m_props.angle) ||
      !IsEqual(props.segmentAngle1, m_props.segmentAngle1) || !IsEqual(props.segmentAngle2, m_props.segmentAngle2))
  {
    m_props = props;
    propsChanged();
  }
}

void SphereNode::computeShape()
{
  double angle = fmin(fmax(m_props.angle, 0), 2 * M_PI);

  TopoDS_Solid sphere;

  if (m_props.segmentAngle1 == 0 && m_props.segmentAngle2 == 0)
  {
    if (m_props.angle == 0)
    {
      sphere = BRepPrimAPI_MakeSphere(m_props.radius);
    }
    else
    {
      sphere = BRepPrimAPI_MakeSphere(m_props.radius, angle);
    }
  }
  else
  {
    double segmentAngle1 = fmin(fmax(m_props.segmentAngle1, -M_PI_2), M_PI_2);
    double segmentAngle2 = fmin(fmax(m_props.segmentAngle2, -M_PI_2), segmentAngle1);

    if (m_props.angle == 0)
    {
      sphere = BRepPrimAPI_MakeSphere(m_props.radius, segmentAngle2, segmentAngle1);
    }
    else
    {

      sphere = BRepPrimAPI_MakeSphere(m_props.radius, segmentAngle2, segmentAngle1, angle);
    }
  }

  shape = sphere;
}
