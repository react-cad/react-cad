#include <BRepBuilderAPI_Transform.hxx>

#include "TransformationNode.h"

TransformationNode::TransformationNode()
{
  m_transform = gp_Trsf();
}

TransformationNode::~TransformationNode()
{
}

void TransformationNode::renderShape()
{
  BRepBuilderAPI_Transform theTransform(m_transform);
  theTransform.Perform(m_childShape, true);
  shape = theTransform.Shape();
}
