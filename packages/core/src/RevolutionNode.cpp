#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepPrimAPI_MakeRevol.hxx>

#include <StdFail_NotDone.hxx>

#include <exception>
#include <math.h>

#include "PerformanceTimer.hpp"
#include "RevolutionNode.hpp"
#include "SVGBuilder.hpp"
#include "SVGImage.hpp"
#include "operations.hpp"

RevolutionNode::RevolutionNode()
    : m_props({.axis = "z", .angle = 2 * M_PI}), m_profile(), m_profileChanged(Standard_False)
{
}

RevolutionNode::~RevolutionNode()
{
}

void RevolutionNode::setProps(const RevolutionProps &props)
{
  if (props.axis != m_props.axis || !doubleEquals(props.angle, m_props.angle))
  {
    m_props = props;
    propsChanged();
  }
}

void RevolutionNode::setProfile(const std::vector<Point> &points)
{
  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : points)
  {
    polygon.Add(gp_Pnt(point.x, point.y, point.z));
  }
  polygon.Close();
  BRepBuilderAPI_MakeFace face(polygon);
  m_profile = face;
  propsChanged();
  m_profileChanged = Standard_True;
}

void RevolutionNode::setProfileSVG(const std::string &svg)
{
  PerformanceTimer timer1("Compute profile");
  Handle(SVGImage) image = new SVGImage(svg);
  SVGBuilder builder(image);
  m_profile = builder.Shape();
  propsChanged();
  m_profileChanged = Standard_True;
  timer1.end();
}

void RevolutionNode::computeShape()
{
  gp_Ax1 axis;

  if (m_props.axis == "x")
  {
    axis = gp::OX();
  }
  if (m_props.axis == "y")
  {
    axis = gp::OY();
  }
  if (m_props.axis == "z")
  {
    axis = gp::OZ();
  }

  double angle = fmin(fmax(m_props.angle, 0), 2 * M_PI);

  try
  {
    BRepPrimAPI_MakeRevol revolution(m_profile, axis, angle);
    shape = revolution;
  }
  catch (const StdFail_NotDone &e)
  {
    shape = TopoDS_Solid();
  }
}
