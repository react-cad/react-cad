#include "SVGSubPath.hpp"

#include <BRepBndLib.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <BRep_Tool.hxx>
#include <IntTools_Context.hxx>
#include <Precision.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS.hxx>

SVGSubPath::SVGSubPath(TopoDS_Wire wire, TopoDS_Face face, Direction direction)
    : m_parent(), m_wire(wire), m_direction(direction), m_box(), m_children(), m_face(face)
{
  BRepBndLib bnd;
  bnd.Add(m_face, m_box);
}

void SVGSubPath::Add(const Handle(SVGSubPath) & child)
{
  if (child.IsNull())
  {
    return;
  }
  child->m_parent = this;
  m_children.Append(child);
}

void SVGSubPath::Remove(const Handle(SVGSubPath) & child)
{
  if (m_children.Contains(child))
  {
    m_children.Remove(child);
  }
  if (!child.IsNull())
  {
    child->m_parent = nullptr;
  }
}

Bnd_Box SVGSubPath::GetBndBox()
{
  return m_box;
}

Standard_Boolean SVGSubPath::HasParent()
{
  return !m_parent.IsNull();
}

TopoDS_Compound SVGSubPath::BuildFaces(NSVGfillRule fillRule)
{
  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  NCollection_List<TopoDS_Face> faces;
  BRepBuilderAPI_MakeFace makeFace;

  switch (fillRule)
  {
  case NSVG_FILLRULE_EVENODD:
    BuildFaceEvenOdd(faces, makeFace, 0);
    break;
  case NSVG_FILLRULE_NONZERO:
    BuildFaceNonZero(faces, makeFace, 0);
    break;
  default:
    break;
  }

  for (auto face : faces)
  {
    builder.Add(compound, face);
  }

  return compound;
}

void SVGSubPath::Dump(std::iostream &out, std::string indent)
{
  gp_Pnt min = m_box.CornerMin();
  gp_Pnt max = m_box.CornerMax();
  out << indent << "xmin: " << min.X() << ", ymin: " << min.Y() << ", zmin: " << min.Z() << "\n";
  out << indent << "xmax: " << max.X() << ", ymax: " << max.Y() << ", zmax: " << max.Z() << "\n";

  std::string childIndent = indent + "  ";
  for (auto child : m_children)
  {
    child->Dump(out, childIndent);
  }
}

void SVGSubPath::BuildFaceNonZero(NCollection_List<TopoDS_Face> &allFaces, BRepBuilderAPI_MakeFace &currentFace,
                                  int oldCount)
{
  int newCount = oldCount + (m_direction == Direction::CW ? 1 : -1);

  if (oldCount == 0)
  {
    // Nonzero child of a hole, start new face
    BRepBuilderAPI_MakeFace makeFace(m_face);

    for (auto child : m_children)
    {
      child->BuildFaceNonZero(allFaces, makeFace, newCount);
    }

    allFaces.Append(makeFace);
    return;
  }
  else if (newCount == 0)
  {
    // Zero child of a non-hole, cut a hole in existing face
    currentFace.Add(m_wire);
  }
  else
  {
    // Nonzero child of nonzero face, ignore
  }

  for (auto child : m_children)
  {
    child->BuildFaceNonZero(allFaces, currentFace, newCount);
  }
}

void SVGSubPath::BuildFaceEvenOdd(NCollection_List<TopoDS_Face> &allFaces, BRepBuilderAPI_MakeFace &currentFace,
                                  int oldCount)
{
  int newCount = oldCount + (m_direction == Direction::CW ? 1 : -1);

  if (newCount % 2 != 0)
  {
    // Odd child of an even hole, start new face
    BRepBuilderAPI_MakeFace makeFace(m_face);

    for (auto child : m_children)
    {
      child->BuildFaceEvenOdd(allFaces, makeFace, newCount);
    }

    allFaces.Append(makeFace);
  }
  else
  {
    // Even child of an odd face, cut a hole
    currentFace.Add(m_wire);

    for (auto child : m_children)
    {
      child->BuildFaceEvenOdd(allFaces, currentFace, newCount);
    }
  }
}

Standard_Boolean SVGSubPath::IsAncestorOf(const Handle(SVGSubPath) & other)
{
  if (other.IsNull())
  {
    return Standard_False;
  }
  if (other->m_parent.IsNull())
  {
    return Standard_False;
  }
  if (other->m_parent == this)
  {
    return Standard_True;
  }
  return IsAncestorOf(other->m_parent);
}

Standard_Boolean SVGSubPath::IsInside(const Handle(SVGSubPath) & other)
{
  if (m_box.IsOut(other->m_box))
  {
    return Standard_False;
  }

  TopExp_Explorer exp;
  exp.Init(m_face, TopAbs_VERTEX);
  TopoDS_Vertex vertex = TopoDS::Vertex(exp.Current());
  gp_Pnt point = BRep_Tool::Pnt(vertex);

  IntTools_Context intTools;

  return intTools.IsPointInFace(point, other->m_face, Precision::Confusion());
}

SVGSubPath::Inspector::Inspector(const Target &thePath) : m_subpath(thePath)
{
}

NCollection_CellFilter_Action SVGSubPath::Inspector::Inspect(const Target other)
{
  if (!other->IsAncestorOf(m_subpath->m_parent) && m_subpath->IsInside(other))
  {
    other->Add(m_subpath);
    return CellFilter_Keep;
  }

  if (!m_subpath->IsAncestorOf(other) && other->IsInside(m_subpath))
  {
    if (other->m_parent)
    {
      other->m_parent->Remove(other);
    }
    m_subpath->Add(other);
  }

  return CellFilter_Keep;
}
