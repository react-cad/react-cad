#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeVertex.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakeEvolved.hxx>
#include <BRep_Builder.hxx>
#include <ShapeFix_Wire.hxx>
#include <TCollection_AsciiString.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>

#include <Geom2d_Curve.hxx>
#include <Geom_Plane.hxx>

#include "EvolutionNode.hpp"

#include "PerformanceTimer.hpp"
#include "operations.hpp"

#include "PolygonBuilder.hpp"
#include "SVGBuilder.hpp"
#include "SVGPathBuilder.hpp"

EvolutionNode::EvolutionNode() : m_spineBuilder(), m_profileBuilder()
{
}

void EvolutionNode::setProfile(const NCollection_Array1<gp_Pnt> &points)
{
  m_profileBuilder = new PolygonBuilder(points, Standard_False);
  propsChanged();
}

void EvolutionNode::setProfileSVG(const std::string &pathData)
{
  Handle(Geom_Plane) yzPlane = new Geom_Plane(gp_Ax3(gp::Origin(), gp::DX(), gp::DY()));
  m_profileBuilder = new SVGPathBuilder(pathData, yzPlane);
  propsChanged();
}

void EvolutionNode::setSpine(const NCollection_Array1<gp_Pnt> &points)
{
  m_spineBuilder = new PolygonBuilder(points, true);
  propsChanged();
}

void EvolutionNode::setSpineSVG(const std::string &svg)
{
  m_spineBuilder = new SVGBuilder(svg);
  propsChanged();
}

bool EvolutionNode::computeShape(const Message_ProgressRange &theRange)
{
  PerformanceTimer timer("Build evolution");
  shape = TopoDS_Shape();
  bool success = true;

  GeomAbs_JoinType aJoinType = GeomAbs_Arc;
  Standard_Boolean aIsGlobalCS = Standard_True;
  Standard_Boolean aIsSolid = Standard_True;

  TopoDS_Shape spine = m_spineBuilder->Shape();
  TopoDS_Shape profile = m_profileBuilder->Shape();

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Ex;
  int nbFaces = 0;
  for (Ex.Init(spine, TopAbs_FACE); Ex.More(); Ex.Next())
  {
    ++nbFaces;
  }

  Message_ProgressScope scope(theRange, "Computing evolution", nbFaces);

  int faceId = 0;
  for (Ex.ReInit(); Ex.More() && scope.More(); Ex.Next())
  {
    // TODO: Parallel
    BRepOffsetAPI_MakeEvolved anAlgo(Ex.Current(), TopoDS::Wire(profile), aJoinType, aIsGlobalCS, aIsSolid);
    anAlgo.Build();

    if (anAlgo.IsDone())
    {
      builder.Add(compound, anAlgo.Shape());
    }
    else
    {
      addError("Could not make evolved for face " + std::to_string(faceId));
      success = false;
    }
    scope.Next();

    ++faceId;
  }

  shape = compound;

  timer.end();

  return success;
}
