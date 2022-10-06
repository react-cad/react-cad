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

#include "SVGBuilder.hpp"
#include "SVGImage.hpp"

EvolutionNode::EvolutionNode() : m_spine(), m_profile()
{
}

void EvolutionNode::setProfile(const NCollection_Array1<gp_Pnt> &points)
{
  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : points)
  {
    TopoDS_Vertex vertex = BRepBuilderAPI_MakeVertex(point);
    polygon.Add(vertex);
  }
  m_profile = polygon;
  propsChanged();
}

void EvolutionNode::setProfileSVG(const std::string &pathData)
{
  SVGImage image = SVGImage::FromPathData(pathData);

  Handle(Geom_Plane) yzPlane = new Geom_Plane(gp_Ax3(gp::Origin(), gp::DX(), gp::DY()));

  auto shape = image.begin();
  if (shape != image.end())
  {
    auto path = shape.begin();
    if (path != shape.end())
    {
      BRepBuilderAPI_MakeWire makeWire;

      for (auto curve = path.begin(); curve != path.end(); ++curve)
      {
        Handle(Geom2d_Curve) c = curve;
        if (!c.IsNull())
        {
          c->Translate(gp_Vec2d(0, image.Height()));
          BRepBuilderAPI_MakeEdge edge(c, yzPlane);
          makeWire.Add(edge);
        }
      }

      TopoDS_Wire suspiciousWire = makeWire;

      BRepLib::BuildCurves3d(suspiciousWire);

      ShapeFix_Wire fixWire;
      fixWire.SetSurface(yzPlane);
      fixWire.Load(suspiciousWire);
      fixWire.ClosedWireMode() = Standard_False;
      fixWire.Perform();

      TopoDS_Wire wire = fixWire.Wire();

      m_profile = wire;

      propsChanged();
    }
  }
}

void EvolutionNode::setSpine(const NCollection_Array1<gp_Pnt> &points)
{
  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : points)
  {
    TopoDS_Vertex vertex = BRepBuilderAPI_MakeVertex(point);
    polygon.Add(vertex);
  }
  polygon.Close();
  BRepBuilderAPI_MakeFace face(polygon);
  m_spine = face;
  propsChanged();
}

void EvolutionNode::setSpineSVG(const std::string &svg)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer1("Compute profile");
#endif
  Handle(SVGImage) image = new SVGImage(svg);
  SVGBuilder builder(image);
  m_spine = builder.Shape();
  propsChanged();
#ifdef REACTCAD_DEBUG
  timer1.end();
#endif
}

void EvolutionNode::computeShape(const Message_ProgressRange &theRange)
{
  PerformanceTimer timer("Build evolution");
  GeomAbs_JoinType aJoinType = GeomAbs_Arc;
  Standard_Boolean aIsGlobalCS = Standard_True;
  Standard_Boolean aIsSolid = Standard_True;

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Ex;
  int nbFaces = 0;
  for (Ex.Init(m_spine, TopAbs_FACE); Ex.More(); Ex.Next())
  {
    ++nbFaces;
  }

  Message_ProgressScope scope(theRange, "Computing evolution", nbFaces);

  for (Ex.ReInit(); Ex.More() && scope.More(); Ex.Next())
  {
    // TODO: Parallel
    BRepOffsetAPI_MakeEvolved anAlgo(Ex.Current(), m_profile, aJoinType, aIsGlobalCS, aIsSolid);
    anAlgo.Build();

    builder.Add(compound, anAlgo.Shape());
    scope.Next();
  }

  shape = compound;

  timer.end();
}
