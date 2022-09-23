#include "DifferenceNode.hpp"
#include "PerformanceTimer.hpp"
#include "operations.hpp"

#include <TopTools_ListOfShape.hxx>

DifferenceNode::DifferenceNode()
{
}

void DifferenceNode::computeChildren(TopTools_ListOfShape children)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate difference");
#endif
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
#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
