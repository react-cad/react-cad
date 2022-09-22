#include <BRepBuilderAPI_GTransform.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepPrimAPI_MakePrism.hxx>

#include <Precision.hxx>
#include <gp_Ax2.hxx>
#include <gp_GTrsf.hxx>

#include "PerformanceTimer.hpp"
#include "PrismNode.hpp"
#include "SVGBuilder.hpp"
#include "SVGImage.hpp"
#include "operations.hpp"

PrismNode::PrismNode() : m_vector(0, 0, 1)
{
}

void PrismNode::setVector(Point point)
{
  gp_Vec newVector(point.x, point.y, point.z);
  if (!newVector.IsEqual(m_vector, Precision::Confusion(), Precision::Angular()))
  {
    m_vector = newVector;
    propsChanged();
  }
}

void PrismNode::computeShape()
{
  PerformanceTimer timer("Compute prism");

  BRepPrimAPI_MakePrism prism(m_profile, m_vector);

  shape = prism;
  timer.end();
}
