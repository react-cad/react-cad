#include "operations.hpp"

#include <BRepAlgoAPI_BuilderAlgo.hxx>
#include <BRepAlgoAPI_Common.hxx>
#include <BRepAlgoAPI_Cut.hxx>

TopoDS_Shape unionOp(TopTools_ListOfShape shapes, const Message_ProgressRange &theRange)
{
  switch (shapes.Size())
  {
  case 0:
    return TopoDS_Shape();
  case 1:
    return shapes.First();
  default: {
    BRepAlgoAPI_BuilderAlgo aBuilder;

    aBuilder.SetArguments(shapes);

    aBuilder.Build(theRange);
    if (aBuilder.HasErrors())
    {
      TopoDS_Shape nullShape;
      return nullShape;
    }
    return aBuilder.Shape();
  }
  }
}

TopoDS_Shape differenceOp(TopoDS_Shape positive, TopTools_ListOfShape negative, const Message_ProgressRange &theRange)
{
  if (negative.Size() == 0)
  {
    return positive;
  }

  BRepAlgoAPI_Cut aBuilder;

  TopTools_ListOfShape aLS;
  aLS.Append(positive);

  aBuilder.SetArguments(aLS);
  aBuilder.SetTools(negative);

  aBuilder.Build(theRange);
  if (aBuilder.HasErrors())
  {
    TopoDS_Shape nullShape;
    return nullShape;
  }
  return aBuilder.Shape();
}

TopoDS_Shape differenceOp(TopoDS_Shape positive, TopoDS_Shape negative, const Message_ProgressRange &theRange)
{
  TopTools_ListOfShape aLT;
  aLT.Append(negative);
  return differenceOp(positive, aLT, theRange);
}

TopoDS_Shape intersectionOp(TopoDS_Shape positive, TopoDS_Shape negative, const Message_ProgressRange &theRange)
{
  TopTools_ListOfShape aLS;
  aLS.Append(positive);
  TopTools_ListOfShape aLT;
  aLT.Append(negative);

  BRepAlgoAPI_Common aBuilder;
  aBuilder.SetArguments(aLS);
  aBuilder.SetTools(aLT);

  aBuilder.Build(theRange);

  if (aBuilder.HasErrors())
  {
    TopoDS_Shape nullShape;
    return nullShape;
  }

  return aBuilder.Shape();
}

TopoDS_Shape intersectionOp(TopTools_ListOfShape shapes, const Message_ProgressRange &theRange)
{
  if (shapes.Size() == 0)
  {
    return TopoDS_Shape();
  }

  TopoDS_Shape result = shapes.First();
  shapes.RemoveFirst();

  while (shapes.Size())
  {
    TopoDS_Shape shape = shapes.First();
    shapes.RemoveFirst();

    result = intersectionOp(result, shape, theRange);
  }

  return result;
}
