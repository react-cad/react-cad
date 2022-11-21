#include "BooleanOperation.hpp"

#include <BRepAlgoAPI_Common.hxx>
#include <BRepAlgoAPI_Cut.hxx>
#include <BRepAlgoAPI_Fuse.hxx>

BooleanOperation::BooleanOperation() : m_hasErrors(false), m_errors(), m_shape(){};

void BooleanOperation::Difference(TopoDS_Shape positive, TopTools_ListOfShape negative, const ProgressHandler &handler)
{
  m_shape = TopoDS_Shape();
  m_hasErrors = Standard_False;

  if (negative.Size() == 0)
  {
    m_shape = positive;
    return;
  }

  BRepAlgoAPI_Cut aBuilder;

  TopTools_ListOfShape aLS;
  aLS.Append(positive);

  aBuilder.SetArguments(aLS);
  aBuilder.SetTools(negative);

  aBuilder.Build(/*theRange*/);
  if (aBuilder.HasErrors())
  {
    m_hasErrors = Standard_True;
    std::stringstream os;
    aBuilder.DumpErrors(os);
    m_errors = os.str();
    return;
  }

  m_shape = aBuilder.Shape();
}

void BooleanOperation::Difference(TopoDS_Shape positive, TopoDS_Shape negative, const ProgressHandler &handler)
{
  TopTools_ListOfShape aLT;
  aLT.Append(negative);
  return Difference(positive, aLT, handler);
}

void BooleanOperation::Union(TopTools_ListOfShape shapes, const ProgressHandler &handler)
{
  m_shape = TopoDS_Shape();
  m_hasErrors = Standard_False;

  switch (shapes.Size())
  {
  case 0:
    return;
  case 1:
    m_shape = shapes.First();
    return;
  default: {
    BRepAlgoAPI_Fuse aBuilder;

    TopTools_ListOfShape arguments;
    arguments.Append(shapes.First());
    shapes.RemoveFirst();

    aBuilder.SetArguments(arguments);
    aBuilder.SetTools(shapes);

    aBuilder.Build(/*theRange*/);
    if (aBuilder.HasErrors())
    {
      m_hasErrors = Standard_True;
      std::stringstream os;
      aBuilder.DumpErrors(os);
      m_errors = os.str();
      return;
    }
    m_shape = aBuilder.Shape();
    return;
  }
  }
}

void BooleanOperation::IntersectionInternal(TopoDS_Shape negative, const ProgressHandler &handler)
{
  TopTools_ListOfShape aLS;
  aLS.Append(m_shape);
  TopTools_ListOfShape aLT;
  aLT.Append(negative);

  BRepAlgoAPI_Common aBuilder;
  aBuilder.SetArguments(aLS);
  aBuilder.SetTools(aLT);

  aBuilder.Build(/*theRange*/);

  if (aBuilder.HasErrors())
  {
    m_hasErrors = Standard_True;
    std::stringstream os;
    aBuilder.DumpErrors(os);
    m_errors = os.str();
    return;
  }

  m_shape = aBuilder.Shape();
}

void BooleanOperation::Intersection(TopTools_ListOfShape shapes, const ProgressHandler &handler)
{
  m_shape = TopoDS_Shape();
  m_hasErrors = Standard_False;

  if (shapes.Size() == 0)
  {
    return;
  }

  m_shape = shapes.First();
  shapes.RemoveFirst();

  if (shapes.Size() == 0)
  {
    return;
  }

  Message_ProgressScope scope(handler, "Intersecting shapes", shapes.Size());

  while (shapes.Size() && scope.More() && !m_hasErrors)
  {
    TopoDS_Shape shape = shapes.First();
    shapes.RemoveFirst();

    IntersectionInternal(shape, handler.WithRange(scope.Next()));
  }
}

Standard_Boolean BooleanOperation::HasErrors()
{
  return m_hasErrors;
}

std::string BooleanOperation::Errors()
{
  return m_errors;
}

TopoDS_Shape BooleanOperation::Shape()
{
  return m_shape;
}
