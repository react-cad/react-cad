#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeVertex.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakeEvolved.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <ShapeFix_Shape.hxx>
#include <ShapeFix_Wireframe.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>

#include <Geom2d_Curve.hxx>
#include <Geom_Plane.hxx>
#include <gp_Pln.hxx>
#include <gp_Quaternion.hxx>

#include <BRepTools.hxx>

#include <math.h>

#include "EvolutionNode.hpp"

#include "PerformanceTimer.hpp"
#include "operations.hpp"

#include "SVGBuilder.hpp"
#include "SVGImage.hpp"

EvolutionNode::EvolutionNode() : m_spine(), m_profile()
{
}

void EvolutionNode::setProfile(const std::vector<Point> &points)
{
  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : points)
  {
    TopoDS_Vertex vertex = BRepBuilderAPI_MakeVertex(gp_Pnt(point.x, point.y, point.z));
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
      fixWire.Perform();

      TopoDS_Wire wire = fixWire.Wire();
      wire.Orientation(TopAbs_REVERSED);

      m_profile = wire;

      propsChanged();
    }
  }
}

void EvolutionNode::setSpine(const std::vector<Point> &points)
{
  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : points)
  {
    TopoDS_Vertex vertex = BRepBuilderAPI_MakeVertex(gp_Pnt(point.x, point.y, point.z));
    polygon.Add(vertex);
  }
  polygon.Close();
  BRepBuilderAPI_MakeFace face(polygon);
  m_spine = face;
  propsChanged();
}

void EvolutionNode::setSpineSVG(const std::string &svg)
{
  PerformanceTimer timer1("Compute profile");
  Handle(SVGImage) image = new SVGImage(svg);
  SVGBuilder builder(image);
  m_spine = builder.Shape();
  propsChanged();
  timer1.end();
}

void EvolutionNode::computeShape()
{
  PerformanceTimer timer("Build evolution");
  GeomAbs_JoinType aJoinType = GeomAbs_Arc;
  Standard_Boolean aIsGlobalCS = Standard_True;
  Standard_Boolean aIsSolid = Standard_True;

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Ex;
  for (Ex.Init(m_spine, TopAbs_FACE); Ex.More(); Ex.Next())
  {
    // TODO: Parallel
    BRepOffsetAPI_MakeEvolved anAlgo(Ex.Current(), m_profile, aJoinType, aIsGlobalCS, aIsSolid);
    anAlgo.Build();

    builder.Add(compound, anAlgo.Shape());
  }

  shape = compound;

  timer.end();
}
