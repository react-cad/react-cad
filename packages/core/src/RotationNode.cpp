#include "RotationNode.hpp"

#include <Standard_Real.hxx>
#include <gp.hxx>
#include <gp_Trsf.hxx>

RotationNode::RotationNode() : m_angle(0), m_axis(gp::DX()), m_quaternion(gp::DX(), 0)
{
}

RotationNode::~RotationNode()
{
}

void RotationNode::setTransform()
{
  gp_Trsf transform;
  transform.SetRotation(m_quaternion);
  m_transform = gp_GTrsf(transform);
}

void RotationNode::setDirectionAngle(gp_Dir direction, Standard_Real angle)
{
}

void RotationNode::setAxisAngle(Vector direction, Standard_Real angle)
{
  gp_Dir newDirection(direction.x, direction.y, direction.z);

  if (!IsEqual(angle, m_angle) || !newDirection.IsParallel(m_axis, RealEpsilon()))
  {
    m_angle = angle;
    m_axis = newDirection;
    m_quaternion = gp_Quaternion(m_axis, m_angle);
    setTransform();
    propsChanged();
  }
}

void RotationNode::setEulerAngles(Standard_Real xAngle, Standard_Real yAngle, Standard_Real zAngle)
{
  gp_Quaternion quaternion;
  quaternion.SetEulerAngles(gp_EulerSequence::gp_Extrinsic_XYZ, xAngle, yAngle, zAngle);
  setRotation({.x = quaternion.X(), .y = quaternion.Y(), .z = quaternion.Z(), .w = quaternion.W()});
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
    setTransform();
    propsChanged();
  }
}
