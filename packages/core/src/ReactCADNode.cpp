#include <algorithm>
#include <math.h>

#include <BRepAlgoAPI_BuilderAlgo.hxx>

#include "ReactCADNode.hpp"

#include "PerformanceTimer.hpp"

#include <pthread.h>

pthread_mutex_t ReactCADNode::nodeMutex;

void ReactCADNode::initializeMutex()
{
  pthread_mutexattr_t Attr;
  pthread_mutexattr_init(&Attr);
  pthread_mutexattr_settype(&Attr, PTHREAD_MUTEX_RECURSIVE);
  pthread_mutex_init(&ReactCADNode::nodeMutex, &Attr);
}

void ReactCADNode::lock()
{
  pthread_mutex_lock(&ReactCADNode::nodeMutex);
}

void ReactCADNode::unlock()
{
  pthread_mutex_unlock(&ReactCADNode::nodeMutex);
}

ReactCADNode::ReactCADNode()
    : m_parent(nullptr), shape(TopoDS_Shape()), m_propsChanged(true), m_children(), m_childrenChanged(false),
      m_childShape(TopoDS_Shape())
{
}

ReactCADNode::~ReactCADNode()
{
}

void ReactCADNode::appendChild(std::shared_ptr<ReactCADNode> child)
{
  lock();
  m_children.push_back(child);
  child->m_parent = shared_from_this();
  m_childrenChanged = true;
  notifyAncestors();
  unlock();
}

void ReactCADNode::insertChildBefore(std::shared_ptr<ReactCADNode> child, const ReactCADNode &before)
{
  lock();
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
  unlock();
}

void ReactCADNode::removeChild(ReactCADNode &child)
{
  lock();
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
  unlock();
}

bool ReactCADNode::hasParent()
{
  return m_parent && true;
}

void ReactCADNode::propsChanged()
{
  lock();
  m_propsChanged = true;
  notifyAncestors();
  unlock();
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

bool ReactCADNode::computeGeometry()
{
  bool changed = false;

  lock();
  if (m_propsChanged || m_childrenChanged)
  {
    if (m_childrenChanged)
    {
      std::vector<TopoDS_Shape> shapes;
      for (auto child : m_children)
      {
        child->computeGeometry();
        shapes.push_back(child->shape);
      }
      computeChildren(shapes);
      m_childrenChanged = false;
    }

    computeShape();
    m_propsChanged = false;

    changed = true;
  }
  unlock();

  return changed;
}

void ReactCADNode::computeChildren(const std::vector<TopoDS_Shape> &children)
{
  m_childShape = fuse(children);
}

void ReactCADNode::computeShape()
{
  shape = m_childShape;
}

bool ReactCADNode::isType(const emscripten::val &value, const std::string &type)
{
  std::string valType = value.typeOf().as<std::string>();
  return valType == type;
}

TopoDS_Shape ReactCADNode::fuse(const std::vector<TopoDS_Shape> &children)
{
  switch (children.size())
  {
  case 0:
    return TopoDS_Shape();
  case 1:
    return children[0];
  default: {
    PerformanceTimer timer("Union render time");
    timer.start();
    BRepAlgoAPI_BuilderAlgo aBuilder;

    TopTools_ListOfShape aLS;
    for (TopoDS_Shape shape : children)
    {
      aLS.Append(shape);
    }

    aBuilder.SetArguments(aLS);

    aBuilder.Build();
    if (aBuilder.HasErrors())
    {
      TopoDS_Shape nullShape;
      return nullShape;
    }
    timer.end();
    return aBuilder.Shape();
  }
  }
}

bool ReactCADNode::doubleEquals(double a, double b)
{
  double diff = fabs(a - b);
  a = fabs(a);
  b = fabs(b);

  double largest = (b > a) ? b : a;
  if (diff <= largest * DBL_EPSILON)
  {
    return true;
  }

  return false;
}
