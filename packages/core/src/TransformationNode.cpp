#include <BRepBuilderAPI_GTransform.hxx>

#include "TransformationNode.hpp"

TransformationNode::TransformationNode()
{
  m_transform = gp_Trsf();
}

TransformationNode::~TransformationNode()
{
}

void TransformationNode::computeShape()
{
  BRepBuilderAPI_GTransform theTransform(m_transform);
  theTransform.Perform(m_childShape, true);
  shape = theTransform.Shape();
}
