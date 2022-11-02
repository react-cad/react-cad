#include "MirrorNode.hpp"

#include <BRepBuilderAPI_Transform.hxx>
#include <BRepLib.hxx>
#include <BRepTools.hxx>
#include <Precision.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Solid.hxx>

MirrorNode::MirrorNode()
{
}

void MirrorNode::setPlane(gp_Pnt origin, gp_Vec normal)
{
  gp_Ax2 newAxis(origin, gp_Dir(normal));

  if (!newAxis.IsCoplanar(m_axis, Precision::Confusion(), Precision::Angular()))
  {
    m_axis = newAxis;
    m_trsf.SetMirror(m_axis);
    propsChanged();
  }
}

bool MirrorNode::computeShape(const Message_ProgressRange &theRange)
{
  shape = m_childShape;
  BRepBuilderAPI_Transform theTransform(m_trsf);
  theTransform.Perform(m_childShape, true);
  if (theTransform.IsDone())
  {
    shape = theTransform.Shape();
    return true;
  }
  addError("Could not perform transform");
  return false;
}
