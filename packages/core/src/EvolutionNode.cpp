#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeVertex.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakeEvolved.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <ShapeFix_Shape.hxx>
#include <ShapeFix_Wireframe.hxx>
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

      TopoDS_Wire wire = makeWire;
      BRepLib::BuildCurves3d(wire);

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
  m_spine = polygon;
  propsChanged();
}

void EvolutionNode::setSpineSVG(const std::string &pathData)
{
  SVGImage image = SVGImage::FromPathData(pathData);

  Handle(Geom_Plane) xyPlane = new Geom_Plane(gp_Ax3(gp::Origin(), gp::DZ(), gp::DX()));

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
          BRepBuilderAPI_MakeEdge edge(c, xyPlane);
          makeWire.Add(edge);
        }
      }
      TopoDS_Wire wire = makeWire;
      BRepLib::BuildCurves3d(wire);

      Handle(ShapeFix_Shape) aFShape = new ShapeFix_Shape(wire);
      aFShape->Perform();
      Handle(ShapeFix_Wireframe) aFWire = new ShapeFix_Wireframe(aFShape->Shape());
      aFWire->FixSmallEdges();
      aFWire->FixWireGaps();

      m_spine = TopoDS::Wire(aFWire->Shape());

      propsChanged();
    }
  }
}

void EvolutionNode::computeShape()
{
  PerformanceTimer timer("Build evolution");
  GeomAbs_JoinType aJoinType = GeomAbs_Arc;
  Standard_Boolean aIsGlobalCS = Standard_True;
  Standard_Boolean aIsSolid = Standard_True;

  // TODO: Parallel
  BRepOffsetAPI_MakeEvolved anAlgo(m_spine, m_profile, aJoinType, aIsGlobalCS, aIsSolid);

  anAlgo.Build();

  TopoDS_Shape s = anAlgo.Shape();

  Handle(ShapeFix_Shape) aFShape = new ShapeFix_Shape(s);
  aFShape->Perform();
  Handle(ShapeFix_Wireframe) aFWire = new ShapeFix_Wireframe(aFShape->Shape());
  aFWire->FixSmallEdges();
  aFWire->FixWireGaps();

  shape = aFWire->Shape();
  timer.end();
}
