#include <BRepPrimAPI_MakeRevol.hxx>
#include <Precision.hxx>
#include <gp_Vec.hxx>

#include <StdFail_NotDone.hxx>

#include "RevolutionNode.hpp"

RevolutionNode::RevolutionNode() : m_axis(0, 0, 1), m_angle(0)
{
  setAxisAngle(gp_Vec(0, 0, 1), M_PI);
}

void RevolutionNode::setAxisAngle(gp_Vec axis, Standard_Real angle)
{
  if (!IsEqual(angle, m_angle) || !axis.IsEqual(m_axis, Precision::Confusion(), Precision::Angular()))
  {
    m_angle = angle;
    m_axis = axis;
    propsChanged();
  }
}

void RevolutionNode::computeShape(const ProgressHandler &handler)
{
  setShape(TopoDS_Solid());
  if (m_childShape.IsNull())
  {
    return;
  }

  gp_Ax1 axis(gp::Origin(), m_axis);

  Standard_Real angle = fmin(fmax(m_angle, 0), 2 * M_PI);

  BRepPrimAPI_MakeRevol revolution(m_childShape, axis, angle);
  revolution.Build(/*theRange*/);
  if (revolution.IsDone())
  {
    setShape(revolution.Shape());
  }
  else
  {
    handler.Abort("revolution: construction failed. Does shape intersect axis?");
  }
}
