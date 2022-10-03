#include "AffineNode.hpp"

#include <BRepBuilderAPI_GTransform.hxx>
#include <gp_GTrsf.hxx>
#include <gp_Mat.hxx>
#include <gp_XYZ.hxx>

AffineNode::AffineNode()
{
}

void AffineNode::setMatrix(Matrix matrix)
{
  gp_Mat vectorial(matrix.a1.a1, matrix.a1.a2, matrix.a1.a3, matrix.a2.a1, matrix.a2.a2, matrix.a2.a3, matrix.a3.a1,
                   matrix.a3.a2, matrix.a3.a3);
  gp_XYZ translation(matrix.a1.a4, matrix.a2.a4, matrix.a3.a4);
  m_transform.SetVectorialPart(vectorial);
  m_transform.SetTranslationPart(translation);
  propsChanged();
}

void AffineNode::computeShape(const Message_ProgressRange &theRange)
{
  BRepBuilderAPI_GTransform theTransform(m_transform);
  theTransform.Perform(m_childShape, true);
  shape = theTransform.Shape();
}
