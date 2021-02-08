#include "SweepNode.hpp"
#include "PerformanceTimer.hpp"

#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRep_Builder.hxx>
#include <GCE2d_MakeSegment.hxx>
#include <GeomConvert.hxx>
#include <GeomConvert_CompCurveToBSplineCurve.hxx>
#include <Geom_BSplineCurve.hxx>
#include <Geom_BezierCurve.hxx>
#include <Geom_Plane.hxx>
#include <TopoDS_Compound.hxx>

#include <string.h>

#define NANOSVG_IMPLEMENTATION
#include <nanosvg.h>

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

  Handle(Geom_Surface) plane = new Geom_Plane(gp::Origin(), gp::DZ());

  char *tmp = strdup(m_svg.c_str());
  struct NSVGimage *image = nsvgParse(tmp, "px", 96);
  free(tmp);
  NSVGshape *svgShape = nullptr;
  NSVGpath *svgPath = nullptr;

  for (svgShape = image->shapes; svgShape != NULL; svgShape = svgShape->next)
  {
    std::vector<TopoDS_Wire> positivePaths;
    std::vector<TopoDS_Wire> negativePaths;

    for (svgPath = svgShape->paths; svgPath != NULL; svgPath = svgPath->next)
    {

      GeomConvert_CompCurveToBSplineCurve curve;
      int orientation = 0;

      for (int i = 0; i < svgPath->npts - 1; i += 3)
      {
        float *p = &svgPath->pts[i * 2];

        NCollection_Array1<gp_Pnt> poles(0, 3);
        poles.SetValue(0, gp_Pnt(p[0], -p[1], 0));
        poles.SetValue(1, gp_Pnt(p[2], -p[3], 0));
        poles.SetValue(2, gp_Pnt(p[4], -p[5], 0));
        poles.SetValue(3, gp_Pnt(p[6], -p[7], 0));

        orientation += (p[6] - p[0]) * (-p[7] + -p[1]);

        Handle(Geom_Curve) bezier = new Geom_BezierCurve(poles);
        Handle(Geom_BSplineCurve) bspline = GeomConvert::CurveToBSplineCurve(bezier);
        curve.Add(bspline, 0.01);
      }

      BRepBuilderAPI_MakeEdge edge(curve.BSplineCurve());
      BRepBuilderAPI_MakeWire wire(edge);

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
  nsvgDelete(image);

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
    polygon.Add(gp_Pnt(point.x, point.y, point.z));
  }
  polygon.Close();

  std::vector<TopoDS_Wire> positivePaths;
  std::vector<TopoDS_Wire> negativePaths;

  positivePaths.push_back(polygon);

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
