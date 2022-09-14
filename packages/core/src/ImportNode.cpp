#include "ImportNode.hpp"

ImportNode::ImportNode()
{
}

ImportNode::~ImportNode()
{
}

void ImportNode::setSrc(const std::string &src)
{
  if (src == m_src)
  {
    return;
  }

  m_src = src;
  propsChanged();
}

void ImportNode::computeShape()
{
  parseSrc(m_src);
}
