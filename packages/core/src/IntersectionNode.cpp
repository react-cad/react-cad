#include "IntersectionNode.hpp"
#include "PerformanceTimer.hpp"
#include "operations.hpp"

#include <BRepAlgoAPI_Common.hxx>

IntersectionNode::IntersectionNode()
{
}

void IntersectionNode::computeChildren(TopTools_ListOfShape children, const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate intersection");
#endif
  Message_ProgressScope scope(theRange, "Computing intersection", 1);
  if (!scope.More())
  {
    return;
  }

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
#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
