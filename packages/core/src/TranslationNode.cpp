#include "TranslationNode.hpp"

#include <BRepBuilderAPI_Transform.hxx>
#include <Precision.hxx>

TranslationNode::TranslationNode() : m_vector(0, 0, 0)
{
}

void TranslationNode::setVector(gp_Vec vector)
{
  if (!vector.IsEqual(m_vector, Precision::Confusion(), Precision::Angular()))
  {
    m_vector = vector;
    propsChanged();
  }
}

void TranslationNode::computeShape()
{
  gp_Trsf transform;
  transform.SetTranslation(m_vector);
  BRepBuilderAPI_Transform theTransform(transform);
  theTransform.Perform(m_childShape, true);
  shape = theTransform.Shape();
}
