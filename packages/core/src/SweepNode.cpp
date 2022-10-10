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
#include <Precision.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Compound.hxx>
#include <gp_Ax2.hxx>
#include <gp_Pnt.hxx>
#include <gp_Vec.hxx>

#include <string.h>

#include "PolygonBuilder.hpp"
#include "SVGBuilder.hpp"
#include "SVGImage.hpp"

SweepNode::SweepNode()
{
  NCollection_Array1<gp_Pnt> points(0, 3);
  points[0] = gp_Pnt(-1, -1, 0);
  points[1] = gp_Pnt(-1, 1, 0);
  points[2] = gp_Pnt(1, 1, 0);
  points[3] = gp_Pnt(1, -1, 0);
  setProfile(points);
}

void SweepNode::setProfileSVG(const std::string &svg)
{
  m_profileBuilder = new SVGBuilder(svg);
  propsChanged();
}

TopoDS_Shape SweepNode::getProfile()
{
  return m_profileBuilder->Shape();
}

void SweepNode::setProfile(const NCollection_Array1<gp_Pnt> &points)
{
  m_profileBuilder = new PolygonBuilder(points, true);
  propsChanged();
}
