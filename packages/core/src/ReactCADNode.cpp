#include <algorithm>
#include <math.h>

#include <BRepAlgoAPI_BuilderAlgo.hxx>
#include <BRepBuilderAPI_Transform.hxx>
#include <BRep_Builder.hxx>
#include <Message.hxx>
#include <Message_ProgressScope.hxx>
#include <TopoDS_Compound.hxx>
#include <gp_Ax2.hxx>
#include <gp_Trsf.hxx>

#include "BooleanOperation.hpp"
#include "ReactCADNode.hpp"

#include "PerformanceTimer.hpp"

ReactCADNode::ReactCADNode()
    : m_parent(), m_shape(), m_propsChanged(true), m_children(), m_childrenChanged(false), m_childShape(TopoDS_Shape())
{
}

ReactCADNode::~ReactCADNode()
{
}

void ReactCADNode::setShape(const TopoDS_Shape &shape)
{
  m_shape = shape;
}

TopoDS_Shape ReactCADNode::getShape(const ProgressHandler &handler)
{
  if (m_shape.IsNull())
  {
    return m_shape;
  }

  gp_Ax2 mirror(gp::Origin(), gp::DY());
  gp_Trsf trsf;
  trsf.SetMirror(mirror);
  BRepBuilderAPI_Transform transform(trsf);
  transform.Perform(m_shape, true);
  TopoDS_Shape shape = transform.Shape();

  return shape;
}

void ReactCADNode::appendChild(Handle(ReactCADNode) & child)
{
  m_children.push_back(child);
  child->m_parent = this;
  m_childrenChanged = true;
  notifyAncestors();
}

void ReactCADNode::insertChildBefore(Handle(ReactCADNode) & child, const Handle(ReactCADNode) & before)
{
  for (auto it = std::begin(m_children); it != std::end(m_children); ++it)
  {
    if (*it == child)
    {
      m_children.erase(it);
      break;
    }
  }

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
}

void ReactCADNode::removeChild(Handle(ReactCADNode) & child)
{
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
}

bool ReactCADNode::hasParent()
{
  return m_parent && true;
}

void ReactCADNode::propsChanged()
{
  m_propsChanged = true;
  notifyAncestors();
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

void ReactCADNode::computeGeometry(const ProgressHandler &handler)
{
  Message_ProgressScope scope(handler, "Computing geometry", 1);
  if (m_propsChanged || m_childrenChanged)
  {
    if (m_childrenChanged)
    {
      Message_ProgressScope childScope(scope.Next(), "Computing child geometry", m_children.size() + 2);
      TopTools_ListOfShape shapes;
      int i = 0;
      for (auto child = m_children.begin(); child != m_children.end() && childScope.More(); ++child)
      {
        std::stringstream name;
        name << handler.Name() << "/" << i << "-" << (*child)->getName();
        (*child)->computeGeometry(handler.WithRangeAndName(childScope.Next(), name.str()));
        shapes.Append((*child)->m_shape);
        ++i;
      }

      computeChildren(shapes, handler.WithRange(childScope.Next()));

      if (!childScope.More())
      {
        return;
      }

      computeShape(handler.WithRange(childScope.Next()));

      if (childScope.More())
      {
        m_childrenChanged = false;
        m_propsChanged = false;
      }
    }
    else
    {
      computeShape(handler.WithRange(scope.Next()));

      if (scope.More())
      {
        m_propsChanged = false;
      }
    }
  }
}

void ReactCADNode::computeChildren(TopTools_ListOfShape children, const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate union");
#endif

  Message_ProgressScope scope(handler, "Computing union", 1);
  if (scope.More())
  {
    m_childShape = TopoDS_Shape();

    if (children.Size() == 1)
    {
      m_childShape = children.First();
    }
    else if (children.Size() > 1)
    {
      BRep_Builder builder;
      TopoDS_Compound compound;
      builder.MakeCompound(compound);
      for (auto it = children.begin(); it != children.end(); ++it)
      {
        builder.Add(compound, *it);
      }
      m_childShape = compound;
    }
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}

void ReactCADNode::computeShape(const ProgressHandler &handler)
{
  m_shape = m_childShape;
}
