#include "RotationNode.hpp"

#include <Standard_Real.hxx>
#include <gp.hxx>

RotationNode::RotationNode() : m_angle(0), m_axis(gp::DX()), m_quaternion(gp::DX(), 0)
{
}

RotationNode::~RotationNode()
{
}

void RotationNode::setDirectionAngle(gp_Dir direction, Standard_Real angle)
{
  if (!IsEqual(angle, m_angle) || !direction.IsParallel(m_axis, RealEpsilon()))
  {
    m_angle = angle;
    m_axis = direction;
    m_quaternion = gp_Quaternion(m_axis, m_angle);
    m_transform.SetRotation(m_quaternion);
    propsChanged();
  }
}

void RotationNode::setAxisAngle(Point direction, Standard_Real angle)
{
  gp_Dir newDirection(direction.x, direction.y, direction.z);
  setDirectionAngle(newDirection, angle);
}

void RotationNode::setAxisNameAngle(std::string axis, Standard_Real angle)
{
  if (axis == "x")
  {
    setDirectionAngle(gp::DX(), angle);
  }
  else if (axis == "y")
  {
    setDirectionAngle(gp::DY(), angle);
  }
  else if (axis == "z")
  {
    setDirectionAngle(gp::DZ(), angle);
  }
}

void RotationNode::setRotation(Quaternion quaternion)
{
  gp_Quaternion newQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

  if (!newQuaternion.IsEqual(m_quaternion))
  {
    m_quaternion = newQuaternion;
    gp_Vec vector;
    m_quaternion.GetVectorAndAngle(vector, m_angle);
    m_axis = vector;
    m_transform.SetRotation(m_quaternion);
    propsChanged();
  }
}
