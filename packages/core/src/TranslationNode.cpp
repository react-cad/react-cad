#include "TranslationNode.hpp"

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
    m_transform.SetTranslationPart(gp_XYZ(m_props.x, m_props.y, m_props.z));
    propsChanged();
  }
}
