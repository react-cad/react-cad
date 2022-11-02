#include <BRepPrimAPI_MakePrism.hxx>

#include <Precision.hxx>
#include <gp_Vec.hxx>

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

bool PrismNode::computeShape(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Compute prism");
#endif
  shape = TopoDS_Shape();

  TopoDS_Shape profile = getProfile();

  Message_ProgressScope scope(theRange, "Computing prism", 1);

  BRepPrimAPI_MakePrism prism(profile, m_vector);
  prism.Build(/*theRange*/);
  if (!prism.IsDone())
  {
    addError("Prism could not be constructed");
    return false;
  }

  shape = prism.Shape();

#ifdef REACTCAD_DEBUG
  timer.end();
#endif

  return true;
}
