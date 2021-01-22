#include <BRepBuilderAPI_Transform.hxx>

#include "TransformationFactory.h"

TransformationFactory::TransformationFactory() : transform(gp_Trsf())
{
}

TransformationFactory::~TransformationFactory()
{
}

TopoDS_Shape TransformationFactory::render()
{
  BRepBuilderAPI_Transform theTransform(transform);
  theTransform.Perform(m_children, true);
  return theTransform.Shape();
}
