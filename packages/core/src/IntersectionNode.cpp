#include "IntersectionNode.hpp"
#include "BooleanOperation.hpp"
#include "PerformanceTimer.hpp"

#include <BRepAlgoAPI_Common.hxx>

IntersectionNode::IntersectionNode()
{
}

void IntersectionNode::computeChildren(TopTools_ListOfShape children, const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate intersection");
#endif
  m_childShape = TopoDS_Shape();

  Message_ProgressScope scope(handler, "Computing intersection", 1);
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
    BooleanOperation op;
    op.Intersection(children, handler.WithRange(scope.Next()));
    if (op.HasErrors())
    {
      handler.Abort("intersection: " + op.Errors());
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
