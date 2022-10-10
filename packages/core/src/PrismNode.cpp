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

void PrismNode::computeShape(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Compute prism");
#endif

  TopoDS_Shape profile = getProfile();

  Message_ProgressScope scope(theRange, "Computing prism", 1);

  BRepPrimAPI_MakePrism prism(profile, m_vector);

  shape = prism;

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
