#include "TranslationNode.hpp"

#include <BRepBuilderAPI_Transform.hxx>

TranslationNode::TranslationNode() : m_props({.x = 0, .y = 0, .z = 0})
{
}

TranslationNode::~TranslationNode()
{
}

void TranslationNode::setProps(const TranslationProps &props)
{
  if (!doubleEquals(m_props.x, props.x) || !doubleEquals(m_props.y, props.y) || !doubleEquals(m_props.z, props.z))
  {
    m_props = props;
    propsChanged();
  }
}

void TranslationNode::computeShape()
{
  gp_Trsf transform;
  transform.SetTranslation(gp_Vec(m_props.x, m_props.y, m_props.z));
  BRepBuilderAPI_Transform theTransform(transform);
  theTransform.Perform(m_childShape, true);
  shape = theTransform.Shape();
}
