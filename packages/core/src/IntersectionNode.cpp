#include "IntersectionNode.hpp"
#include "PerformanceTimer.hpp"

#include <BRepAlgoAPI_Common.hxx>

IntersectionNode::IntersectionNode()
{
}

IntersectionNode::~IntersectionNode()
{
}

void IntersectionNode::computeChildren(const std::vector<TopoDS_Shape> &children)
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
    PerformanceTimer timer("Intersection render time");
    timer.start();
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

    timer.end();
    return aLS.First();
  }
  }
}
