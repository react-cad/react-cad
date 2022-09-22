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

#include "SVGBuilder.hpp"
#include "SVGImage.hpp"

SweepNode::SweepNode() : m_points()
{
  std::vector<Point> points(
      {{.x = -1, .y = -1, .z = 0}, {.x = -1, .y = 1, .z = 0}, {.x = 1, .y = 1, .z = 0}, {.x = 1, .y = -1, .z = 0}});
  setProfile(points);
}

SweepNode::~SweepNode()
{
}

void SweepNode::setProfileSVG(const std::string &svg)
{
  if (!m_isSVG)
  {
    propsChanged();
  }
  else if (svg == m_svg && m_isSVG)
  {
    return;
  }
  m_isSVG = Standard_True;
  m_svg = svg;

  PerformanceTimer timer1("Compute profile");
  Handle(SVGImage) image = new SVGImage(svg);
  SVGBuilder builder(image);
  m_profile = builder.Shape();
  propsChanged();
  m_profileChanged = Standard_True;
  timer1.end();
}

void SweepNode::setProfile(const std::vector<Point> &points)
{
  Standard_Boolean changed = m_isSVG;
  m_isSVG = Standard_False;

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
      if (!IsEqual(m_points[i].x, points[i].x) || !IsEqual(m_points[i].y, points[i].y) ||
          !IsEqual(m_points[i].z, points[i].z))
      {
        m_points[i] = points[i];
        changed = true;
      }
    }
  }

  if (changed)
  {
    BRepBuilderAPI_MakePolygon polygon;
    for (auto point : points)
    {
      polygon.Add(gp_Pnt(point.x, point.y, point.z));
    }
    polygon.Close();
    BRepBuilderAPI_MakeFace face(polygon);
    m_profile = face;
    m_profileChanged = Standard_True;
    propsChanged();
  }
}
