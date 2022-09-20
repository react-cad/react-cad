#include "SweepNode.hpp"
#include "PerformanceTimer.hpp"

#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeVertex.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepBuilderAPI_Transform.hxx>
#include <BRepLib.hxx>
#include <BRep_Builder.hxx>
#include <Geom2dConvert.hxx>
#include <Geom2dConvert_CompCurveToBSplineCurve.hxx>
#include <Geom_BSplineCurve.hxx>
#include <Geom_BezierCurve.hxx>
#include <Geom_Plane.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Compound.hxx>
#include <gp_Ax2.hxx>
#include <gp_Vec.hxx>

#include <string.h>

#include "SVGImage.hpp"

SweepNode::SweepNode()
{
  m_points = std::vector<Point>(
      {{.x = -1, .y = -1, .z = 0}, {.x = -1, .y = 1, .z = 0}, {.x = 1, .y = 1, .z = 0}, {.x = 1, .y = -1, .z = 0}});
  makeProfileFromPoints();
  m_pointsChanged = true;
  m_type = Type::Polygon;
}

SweepNode::~SweepNode()
{
}

void SweepNode::setSVGProfile(const std::string &svg)
{
  if (svg != m_svg || m_type != Type::SVG)
  {
    m_svg = svg;
    m_svgChanged = true;
    propsChanged();
  }
  m_type = Type::SVG;
}

void SweepNode::makeProfileFromSVG()
{
  if (m_type != Type::SVG || !m_svg.length())
  {
    return;
  }

  PerformanceTimer timer("Compute SVG profile");

  wires.clear();

  SVGImage image(m_svg);

  Handle(Geom_Plane) surface = new Geom_Plane(gp_Ax3(gp::Origin(), gp::DZ(), gp::DX()));

  for (auto shape = image.begin(); shape != image.end(); ++shape)
  {
    std::vector<TopoDS_Wire> positivePaths;
    std::vector<TopoDS_Wire> negativePaths;

    for (auto path = shape.begin(); path != shape.end(); ++path)
    {
      int orientation = 0;
      Geom2dConvert_CompCurveToBSplineCurve pathCurve;

      for (auto curve = path.begin(); curve != path.end(); ++curve)
      {
        Handle(Geom2d_Curve) c = curve;
        if (!c.IsNull())
        {
          Handle(Geom2d_BSplineCurve) bspline = Geom2dConvert::CurveToBSplineCurve(curve);
          pathCurve.Add(bspline, 1.0e-6, Standard_True);

          orientation += curve.orientation();
        }
      }

      BRepBuilderAPI_MakeEdge edge(pathCurve.BSplineCurve(), surface);
      BRepBuilderAPI_MakeWire wire(edge);
      BRepLib::BuildCurves3d(wire);

      if (orientation >= 0)
      {
        positivePaths.push_back(wire);
      }
      else
      {
        negativePaths.push_back(wire);
      }
    }

    wires.push_back(ShapeWires(positivePaths, negativePaths));
  }

  m_svgChanged = false;

  timer.end();
}

void SweepNode::setProfile(const std::vector<Point> &points)
{
  m_type = Type::Polygon;

  Standard_Boolean changed = false;

  if (m_points.size() > points.size())
  {
    m_points = std::vector<Point>(points);
    changed = true;
  }
  else
  {
    if (points.size() > m_points.size())
    {
      m_points.resize(points.size());
      changed = true;
    }

    for (size_t i = 0; i < points.size(); ++i)
    {
      if (!doubleEquals(m_points[i].x, points[i].x) || !doubleEquals(m_points[i].y, points[i].y) ||
          !doubleEquals(m_points[i].z, points[i].z))
      {
        m_points[i] = points[i];
        changed = true;
      }
    }
  }

  if (changed)
  {
    propsChanged();
    m_pointsChanged = true;
  }
}

void SweepNode::makeProfileFromPoints()
{
  wires.clear();

  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : m_points)
  {
    TopoDS_Vertex vertex = BRepBuilderAPI_MakeVertex(gp_Pnt(point.x, point.y, point.z));
    polygon.Add(vertex);
  }
  polygon.Close();

  std::vector<TopoDS_Wire> positivePaths;
  std::vector<TopoDS_Wire> negativePaths;

  positivePaths.push_back(polygon.Wire());

  wires.push_back(ShapeWires(positivePaths, negativePaths));

  m_pointsChanged = false;
}

void SweepNode::makeProfile()
{
  switch (m_type)
  {
  case Type::Polygon:
    if (m_pointsChanged)
    {
      makeProfileFromPoints();
      m_profileChanged = true;
    }
    return;
  case Type::SVG:
    if (m_svgChanged)
    {
      makeProfileFromSVG();
      m_profileChanged = true;
    }
    return;
  case Type::Unknown:
    return;
  }
}
