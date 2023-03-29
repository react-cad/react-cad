#ifndef BooleanOperation_HeaderFile
#define BooleanOperation_HeaderFile

#include "ProgressHandler.hpp"
#include <BRepAlgoAPI_BooleanOperation.hxx>
#include <TopTools_ListOfShape.hxx>
#include <TopoDS_Compound.hxx>
#include <TopoDS_Shape.hxx>

class BooleanOperation
{
public:
  BooleanOperation();

  void Difference(TopoDS_Shape positive, TopoDS_Shape negative, const ProgressHandler &handler);
  void Difference(TopoDS_Shape positive, TopTools_ListOfShape negative, const ProgressHandler &handler);

  void Intersection(TopTools_ListOfShape shapes, const ProgressHandler &handler);

  void Union(TopTools_ListOfShape shapes, const ProgressHandler &handler);
  void Union(TopoDS_Shape shape, const ProgressHandler &handler);

  Standard_Boolean HasErrors();
  std::string Errors();
  TopoDS_Shape Shape();

private:
  void IntersectionInternal(TopoDS_Shape otherShape, const ProgressHandler &handler);

  Standard_Boolean m_hasErrors;
  std::string m_errors;
  TopoDS_Shape m_shape;
};

#endif
