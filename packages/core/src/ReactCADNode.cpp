#include <algorithm>
#include <math.h>

#include <BRepAlgoAPI_BuilderAlgo.hxx>

#include "ReactCADNode.hpp"
#include "operations.hpp"

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
    : m_parent(), shape(TopoDS_Shape()), m_propsChanged(true), m_children(), m_childrenChanged(false),
      m_childShape(TopoDS_Shape())
{
}

ReactCADNode::~ReactCADNode()
{
}

void ReactCADNode::appendChild(Handle(ReactCADNode) & child)
{
  lock();
  m_children.push_back(child);
  child->m_parent = this;
  m_childrenChanged = true;
  notifyAncestors();
  unlock();
}

void ReactCADNode::insertChildBefore(Handle(ReactCADNode) & child, const Handle(ReactCADNode) & before)
{
  lock();
  for (auto it = std::begin(m_children); it != std::end(m_children); ++it)
  {
    if (*it == before)
    {
      m_children.insert(it, child);
      child->m_parent = this;
      m_childrenChanged = true;
      notifyAncestors();
      break;
    }
  }
  unlock();
}

void ReactCADNode::removeChild(Handle(ReactCADNode) & child)
{
  lock();
  for (auto it = std::begin(m_children); it != std::end(m_children); ++it)
  {
    if (*it == child)
    {
      child->m_parent = nullptr;
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
  Handle(ReactCADNode) ancestor = m_parent;
  while (!ancestor.IsNull() && !ancestor->m_childrenChanged)
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
      TopTools_ListOfShape shapes;
      for (auto child : m_children)
      {
        child->computeGeometry();
        shapes.Append(child->shape);
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

void ReactCADNode::computeChildren(TopTools_ListOfShape children)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate union");
#endif

  m_childShape = unionOp(children);

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}

void ReactCADNode::computeShape()
{
  shape = m_childShape;
}
