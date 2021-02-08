#include "SweepNode.h"

#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRep_Builder.hxx>
#include <Geom2dConvert.hxx>
#include <Geom2dConvert_CompCurveToBSplineCurve.hxx>
#include <Geom2d_BSplineCurve.hxx>
#include <Geom2d_BezierCurve.hxx>
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
}

SweepNode::~SweepNode()
{
}

void SweepNode::setSVGProfile(const std::string &svg)
{

  Handle(Geom_Surface) plane = new Geom_Plane(gp::Origin(), gp::DZ());

  char *tmp = strdup(svg.c_str());
  struct NSVGimage *image = nsvgParse(tmp, "px", 96);
  free(tmp);
  NSVGshape *svgShape = nullptr;
  NSVGpath *svgPath = nullptr;
  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  for (svgShape = image->shapes; svgShape != NULL; svgShape = svgShape->next)
  {
    for (svgPath = svgShape->paths; svgPath != NULL; svgPath = svgPath->next)
    {
      Geom2dConvert_CompCurveToBSplineCurve curve;
      for (int i = 0; i < svgPath->npts - 1; i += 3)
      {
        float *p = &svgPath->pts[i * 2];

        NCollection_Array1<gp_Pnt2d> poles(0, 3);
        poles.SetValue(0, gp_Pnt2d(p[0], p[1]));
        poles.SetValue(1, gp_Pnt2d(p[2], p[3]));
        poles.SetValue(2, gp_Pnt2d(p[4], p[5]));
        poles.SetValue(3, gp_Pnt2d(p[6], p[7]));

        Handle(Geom2d_Curve) bezier = new Geom2d_BezierCurve(poles);
        Handle(Geom2d_BSplineCurve) bspline = Geom2dConvert::CurveToBSplineCurve(bezier);
        curve.Add(bspline, 0.01);
      }

      BRepBuilderAPI_MakeEdge edge(curve.BSplineCurve(), plane);
      BRepBuilderAPI_MakeWire wire(edge);
      BRepBuilderAPI_MakeFace face(wire);

      builder.Add(compound, face);
    }
  }
  nsvgDelete(image);

  m_face = compound;
  propsChanged();
}

void SweepNode::setProfile(const std::vector<Point> &points)
{
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
    makeProfileFromPoints();
    propsChanged();
  }
}

void SweepNode::makeProfileFromPoints()
{
  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : m_points)
  {
    polygon.Add(gp_Pnt(point.x, point.y, point.z));
  }
  polygon.Close();

  BRepBuilderAPI_MakeFace face(polygon, Standard_True);
  if (face.IsDone())
  {
    m_profile = polygon.Wire();
    m_face = face;
  }
}
