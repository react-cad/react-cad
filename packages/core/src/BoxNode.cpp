#include <BRepPrimAPI_MakeBox.hxx>
#include <Message.hxx>
#include <Message_ProgressScope.hxx>
#include <Precision.hxx>
#include <gp_Pnt.hxx>

#include "BoxNode.hpp"

BoxNode::BoxNode() : m_size(gp_Pnt(1, 1, 1)), m_centered(Standard_False)
{
}

void BoxNode::setSize(gp_Pnt size)
{
  if (!size.IsEqual(m_size, Precision::Confusion()))
  {
    m_size = size;
    propsChanged();
  }
}

void BoxNode::setCentered(Standard_Boolean centered)
{
  if (centered != m_centered)
  {
    m_centered = centered;
    propsChanged();
  }
}

void BoxNode::computeShape(const ProgressHandler &handler)
{
  setShape(TopoDS_Shape());

  BRepPrimAPI_MakeBox makeBox(gp::Origin(), m_size);
  makeBox.Build(/*theRange*/);
  if (!makeBox.IsDone())
  {
    handler.Abort("box: construction failed");
    return;
  }

  TopoDS_Solid box = makeBox.Solid();

  if (m_centered)
  {
    gp_Trsf translation;
    translation.SetTranslation(gp_Vec(-m_size.X() / 2.0, -m_size.Y() / 2.0, -m_size.Z() / 2.0));
    box.Move(translation);
  }

  setShape(box);
}
