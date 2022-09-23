#include "ScaleNode.hpp"

#include <BRepBuilderAPI_GTransform.hxx>
#include <BRepBuilderAPI_Transform.hxx>
#include <gp_Ax2.hxx>
#include <gp_GTrsf.hxx>

ScaleNode::ScaleNode() : m_center(0, 0, 0)
{
}

void ScaleNode::setCenter(Point center)
{
  if (!IsEqual(m_center.X(), center.x) || !IsEqual(m_center.Y(), center.y) || !IsEqual(m_center.Z(), center.z))
  {
    m_center = gp_Pnt(center.x, center.y, center.z);
    propsChanged();
  }
}

void ScaleNode::setScaleFactor(Standard_Real scaleFactor)
{
  if (scaleFactor != m_scaleX || scaleFactor != m_scaleY || scaleFactor != m_scaleZ)
  {
    m_scaleX = m_scaleY = m_scaleZ = scaleFactor;
    propsChanged();
  }
}

void ScaleNode::setScale(Vector scale)
{
  if (scale.x != m_scaleX || scale.y != m_scaleY || scale.z != m_scaleZ)
  {
    m_scaleX = scale.x;
    m_scaleY = scale.y;
    m_scaleZ = scale.z;
    propsChanged();
  }
}

TopoDS_Shape scaleAxis(TopoDS_Shape shape, gp_Pnt center, gp_Dir direction, Standard_Real scale)
{
  gp_Ax2 axis(center, direction);
  gp_GTrsf affinity;
  affinity.SetAffinity(axis, scale);
  BRepBuilderAPI_GTransform aBRepGTrsf(shape, affinity, Standard_False);
  aBRepGTrsf.Build();
  return aBRepGTrsf.Shape();
}

void ScaleNode::computeShape()
{
  TopoDS_Shape tmp = m_childShape;
  if (IsEqual(m_scaleX, m_scaleY) && IsEqual(m_scaleY, m_scaleZ))
  {
    gp_Trsf transform;
    transform.SetScale(m_center, m_scaleX);
    BRepBuilderAPI_Transform aBRepTrsf(tmp, transform);
    aBRepTrsf.Build();
    shape = aBRepTrsf.Shape();
  }
  else
  {
    if (!IsEqual(m_scaleX, 1.0))
    {
      tmp = scaleAxis(tmp, m_center, gp::DX(), m_scaleX);
    }
    if (!IsEqual(m_scaleY, 1.0))
    {
      tmp = scaleAxis(tmp, m_center, gp::DY(), m_scaleY);
    }
    if (!IsEqual(m_scaleZ, 1.0))
    {
      tmp = scaleAxis(tmp, m_center, gp::DZ(), m_scaleZ);
    }
    shape = tmp;
  }
}
