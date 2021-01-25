#include "IntersectionNode.h"

#include <BRepAlgoAPI_Common.hxx>

IntersectionNode::IntersectionNode()
{
}

IntersectionNode::~IntersectionNode()
{
}

void IntersectionNode::renderChildren(const std::vector<TopoDS_Shape> &children)
{
  m_childShape = common(children);
}

TopoDS_Shape IntersectionNode::common(const std::vector<TopoDS_Shape> &children)
{
  switch (children.size())
  {
  case 0:
    return TopoDS_Shape();
  case 1:
    return children.at(0);
  default: {
    TopTools_ListOfShape aLS;
    TopTools_ListOfShape aLT;

    for (int i = 0; i < children.size(); i++)
    {
      if (i == 0)
      {
        aLS.Append(children.at(i));
      }
      else
      {
        aLT.Append(children.at(i));

        BRepAlgoAPI_Common aBuilder;
        aBuilder.SetArguments(aLS);
        aBuilder.SetTools(aLT);

        aBuilder.Build();

        if (aBuilder.HasErrors())
        {
          TopoDS_Shape nullShape;
          return nullShape;
        }

        aLS.Clear();
        aLS.Append(aBuilder.Shape());
        aLT.Clear();
      }
    }

    return aLS.First();
  }
  }
}
