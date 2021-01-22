#include "DifferenceFactory.h"

#include <BRepAlgoAPI_Cut.hxx>

DifferenceFactory::DifferenceFactory()
{
}

DifferenceFactory::~DifferenceFactory()
{
}

void DifferenceFactory::renderChildren(const std::vector<TopoDS_Shape> &children)
{
  m_children = cut(children);
}

TopoDS_Shape DifferenceFactory::cut(const std::vector<TopoDS_Shape> &children)
{
  switch (children.size())
  {
  case 0:
    return TopoDS_Shape();
  case 1:
    return children.at(0);
  default: {
    BRepAlgoAPI_Cut aBuilder;

    TopTools_ListOfShape aLS;
    TopTools_ListOfShape aLT;

    for (TopoDS_Shape shape : children)
    {
      if (shape == children.front())
      {
        aLS.Append(shape);
      }
      else
      {
        aLT.Append(shape);
      }
    }

    aBuilder.SetArguments(aLS);
    aBuilder.SetTools(aLT);

    aBuilder.Build();
    if (aBuilder.HasErrors())
    {
      TopoDS_Shape nullShape;
      return nullShape;
    }
    return aBuilder.Shape();
  }
  }
}
