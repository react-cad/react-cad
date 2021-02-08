#include "DifferenceNode.hpp"
#include "PerformanceTimer.hpp"
#include "operations.hpp"

#include <TopTools_ListOfShape.hxx>

DifferenceNode::DifferenceNode()
{
}

DifferenceNode::~DifferenceNode()
{
}

void DifferenceNode::computeChildren(TopTools_ListOfShape children)
{
  PerformanceTimer timer("Calculate difference");
  switch (children.Size())
  {
  case 0:
    m_childShape = TopoDS_Shape();
    break;
  case 1:
    m_childShape = children.First();
    break;
  default: {
    TopoDS_Shape positive = children.First();
    children.RemoveFirst();
    m_childShape = differenceOp(positive, children);
    break;
  }
  }
  timer.end();
}
