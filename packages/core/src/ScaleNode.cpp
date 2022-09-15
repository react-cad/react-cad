#include "ScaleNode.hpp"

#include <BRepBuilderAPI_GTransform.hxx>
#include <BRepBuilderAPI_Transform.hxx>
#include <gp_Ax2.hxx>
#include <gp_GTrsf.hxx>

ScaleNode::ScaleNode() : m_center(0, 0, 0)
{
}

ScaleNode::~ScaleNode()
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

void ScaleNode::computeShape()
{
  TopoDS_Shape tmp = m_childShape;
  gp_GTrsf affinity;
  gp_Mat matrix(m_scaleX, 0, 0, 0, m_scaleY, 0, 0, 0, m_scaleZ);
  affinity.SetVectorialPart(matrix);
  BRepBuilderAPI_GTransform aBRepGTrsf(tmp, affinity, Standard_False);
  shape = aBRepGTrsf.Shape();
}
