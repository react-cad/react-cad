#include <BRepPrimAPI_MakePrism.hxx>

#include <Precision.hxx>
#include <gp_Vec.hxx>

#include "EmJS.hpp"
#include "PerformanceTimer.hpp"
#include "PrismNode.hpp"

PrismNode::PrismNode() : m_vector(0, 0, 1)
{
}

void PrismNode::setVector(gp_Vec vector)
{
  if (!vector.IsEqual(m_vector, Precision::Confusion(), Precision::Angular()))
  {
    m_vector = vector;
    propsChanged();
  }
}

void PrismNode::computeShape(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Compute prism");
#endif
  setShape(TopoDS_Shape());

  Message_ProgressScope scope(handler, "Computing prism", 1);

  BRepPrimAPI_MakePrism prism(m_childShape, m_vector);
  prism.Build(/*theRange*/);
  if (!prism.IsDone())
  {
    handler.Abort("prism: construction failed");
  }

  if (scope.More())
  {
    setShape(prism.Shape());
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
