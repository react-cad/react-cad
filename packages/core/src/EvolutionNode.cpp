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

#include "SVGPathBuilder.hpp"

EvolutionNode::EvolutionNode() : m_profileBuilder()
{
}

void EvolutionNode::setProfile(const std::string &pathData)
{
  gp_Ax3 position(gp::Origin(), gp::DX(), gp::DY());
  Handle(Geom_Plane) yzPlane = new Geom_Plane(position);
  m_profileBuilder = new SVGPathBuilder(pathData, yzPlane);
  propsChanged();
}

void EvolutionNode::computeShape(const ProgressHandler &handler)
{
  PerformanceTimer timer("Build evolution");
  setShape(TopoDS_Shape());

  GeomAbs_JoinType aJoinType = GeomAbs_Arc;
  Standard_Boolean aIsGlobalCS = Standard_True;
  Standard_Boolean aIsSolid = Standard_True;

  m_profileBuilder->Build(handler);
  if (!m_profileBuilder->IsDone())
  {
    handler.Abort("evolution: could not build profile");
    return;
  }
  TopoDS_Shape profile = m_profileBuilder->Shape(handler);

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Ex;
  int nbFaces = 0;
  for (Ex.Init(m_childShape, TopAbs_FACE); Ex.More(); Ex.Next())
  {
    ++nbFaces;
  }

  Message_ProgressScope scope(handler, "Computing evolution", nbFaces);

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
      handler.Abort("evolution: could not construct evolution for face " + std::to_string(faceId));
      return;
    }
    scope.Next();

    ++faceId;
  }

  if (scope.More())
  {
    setShape(compound);
  }

  timer.end();
}
