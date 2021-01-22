#include <algorithm>

#include "ReactCADNode.h"

ReactCADNode::ReactCADNode(ReactCADShapeFactory *factory)
    : m_parent(nullptr), shape(TopoDS_Shape()), m_shapeFactory(factory), m_propsChanged(false), m_children(),
      m_childrenChanged(false)
{
}

ReactCADNode::~ReactCADNode()
{
}

void ReactCADNode::appendChild(std::shared_ptr<ReactCADNode> child)
{
  m_children.push_back(child);
  child->m_parent = shared_from_this();
  m_childrenChanged = true;
  notifyAncestors();
}

void ReactCADNode::insertChildBefore(std::shared_ptr<ReactCADNode> child, const ReactCADNode &before)
{
  for (auto it = std::begin(m_children); it != std::end(m_children); ++it)
  {
    if (it->get() == &before)
    {
      m_children.insert(it, child);
      child->m_parent = shared_from_this();
      m_childrenChanged = true;
      notifyAncestors();
      break;
    }
  }
}

void ReactCADNode::removeChild(ReactCADNode &child)
{
  for (auto it = std::begin(m_children); it != std::end(m_children); ++it)
  {
    if (it->get() == &child)
    {
      child.m_parent = nullptr;
      m_children.erase(it);
      m_childrenChanged = true;
      notifyAncestors();
      break;
    }
  }
}

bool ReactCADNode::hasParent()
{
  return m_parent && true;
}

void ReactCADNode::setProps(const emscripten::val &newProps)
{
  m_shapeFactory->setProps(newProps);
  m_propsChanged = true;
  notifyAncestors();
}

void ReactCADNode::notifyAncestors()
{
  std::shared_ptr<ReactCADNode> ancestor = m_parent;
  while (ancestor && !ancestor->m_childrenChanged)
  {
    ancestor->m_childrenChanged = true;
    ancestor = ancestor->m_parent;
  }
}

void ReactCADNode::render()
{
  if (m_propsChanged || m_childrenChanged)
  {
    if (m_childrenChanged)
    {
      std::vector<TopoDS_Shape> shapes;
      for (auto child : m_children)
      {
        child->render();
        shapes.push_back(child->shape);
      }
      m_shapeFactory->renderChildren(shapes);
      m_childrenChanged = false;
    }

    shape = m_shapeFactory->render();
    m_propsChanged = false;
  }
}
