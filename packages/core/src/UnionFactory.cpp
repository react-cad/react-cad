#include "UnionFactory.h"

UnionFactory::UnionFactory()
{
}

UnionFactory::~UnionFactory()
{
}

TopoDS_Shape UnionFactory::render()
{
  return m_children;
}
