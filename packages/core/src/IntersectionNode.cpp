#include "IntersectionNode.hpp"
#include "PerformanceTimer.hpp"
#include "operations.hpp"

#include <BRepAlgoAPI_Common.hxx>

IntersectionNode::IntersectionNode()
{
}

IntersectionNode::~IntersectionNode()
{
}

void IntersectionNode::computeChildren(TopTools_ListOfShape children)
{
  PerformanceTimer timer("Calculate intersection");
  switch (children.Size())
  {
  case 0:
    m_childShape = TopoDS_Shape();
    break;
  case 1:
    m_childShape = children.First();
    break;
  default: {
    m_childShape = intersectionOp(children);
    break;
  }
  }
  timer.end();
}
