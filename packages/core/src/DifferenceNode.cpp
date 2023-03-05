#include "DifferenceNode.hpp"
#include "BooleanOperation.hpp"
#include "PerformanceTimer.hpp"

#include <TopTools_ListOfShape.hxx>

DifferenceNode::DifferenceNode()
{
}

void DifferenceNode::computeChildren(TopTools_ListOfShape children, const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate difference");
#endif
  m_childShape = TopoDS_Shape();

  Message_ProgressScope scope(handler, "Computing difference", 1);
  if (!scope.More())
  {
    return;
  }

  switch (children.Size())
  {
  case 0:
    break;
  case 1:
    m_childShape = children.First();
    break;
  default: {
    TopoDS_Shape positive = children.First();
    children.RemoveFirst();
    BooleanOperation op;
    op.Difference(positive, children, handler.WithRange(scope.Next()));
    if (op.HasErrors())
    {
      handler.Abort("difference: " + op.Errors());
    }
    else
    {
      m_childShape = op.Shape();
    }
    break;
  }
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
