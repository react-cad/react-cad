#ifndef SVGSubPath_HeaderFile
#define SVGSubPath_HeaderFile

#include <BRepBuilderAPI_MakeFace.hxx>
#include <Bnd_Box.hxx>
#include <NCollection_CellFilter.hxx>
#include <NCollection_List.hxx>
#include <Standard_Handle.hxx>
#include <Standard_Transient.hxx>

#include <TopoDS_Compound.hxx>
#include <TopoDS_Face.hxx>
#include <TopoDS_Wire.hxx>

#include "ProgressHandler.hpp"
#include "nanosvg.h"

class SVGSubPath : public Standard_Transient
{
public:
  enum Direction
  {
    CW,
    CCW
  };

  SVGSubPath(TopoDS_Wire wire, TopoDS_Face face, Direction direction);

  void Add(const Handle(SVGSubPath) & child);
  void Remove(const Handle(SVGSubPath) & child);

  Standard_Boolean HasParent();
  Standard_Boolean IsAncestorOf(const Handle(SVGSubPath) & other);
  Standard_Boolean IsInside(const Handle(SVGSubPath) & other);
  Bnd_Box GetBndBox();

  TopoDS_Shape BuildFaces(NSVGfillRule fillRule, const ProgressHandler &handler);

  void Dump(std::iostream &out, std::string indent = "");

  class Inspector : public NCollection_CellFilter_InspectorXYZ
  {
  public:
    typedef Handle(SVGSubPath) Target;

    Inspector(const Target &thePath);

    NCollection_CellFilter_Action Inspect(const Target other);

  private:
    Target m_subpath;
  };

private:
  void BuildFaceNonZero(TopTools_ListOfShape &allFaces, BRepBuilderAPI_MakeFace &makeFace, int count);
  void BuildFaceEvenOdd(TopTools_ListOfShape &allFaces, BRepBuilderAPI_MakeFace &makeFace, int count);

  Handle(SVGSubPath) m_parent;
  Direction m_direction;
  TopoDS_Wire m_wire;
  TopoDS_Face m_face;
  NCollection_List<Handle(SVGSubPath)> m_children;
  Bnd_Box m_box;
};

#endif
