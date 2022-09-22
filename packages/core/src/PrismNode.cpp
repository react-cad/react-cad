#include <BRepBuilderAPI_GTransform.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepPrimAPI_MakePrism.hxx>

#include <gp_Ax2.hxx>
#include <gp_GTrsf.hxx>

#include "PerformanceTimer.hpp"
#include "PrismNode.hpp"
#include "SVGBuilder.hpp"
#include "SVGImage.hpp"
#include "operations.hpp"

PrismNode::PrismNode() : m_props({.axis = "z", .height = 1}), m_sectionHeight(1), m_profileChanged(Standard_True)
{
}

PrismNode::~PrismNode()
{
}

void PrismNode::setProps(const PrismProps &props)
{
  if (props.axis != m_props.axis)
  {
    m_axisChanged = true;
  }
  if (!doubleEquals(props.height, m_props.height))
  {
    m_heightChanged = true;
  }

  if (m_axisChanged || m_heightChanged)
  {
    m_props = props;

    propsChanged();
  }
}

void PrismNode::setProfile(const std::vector<Point> &points)
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

void PrismNode::setProfileSVG(const std::string &svg)
{
  PerformanceTimer timer1("Compute profile");
  Handle(SVGImage) image = new SVGImage(svg);
  SVGBuilder builder(image);
  m_profile = builder.Shape();
  propsChanged();
  m_profileChanged = Standard_True;
  timer1.end();
}

void PrismNode::computeSection()
{
  PerformanceTimer timer2("Compute prism section");
  m_sectionHeight = m_props.height;

  gp_Vec axis;

  if (m_props.axis == "x")
  {
    axis.SetX(m_sectionHeight);
  }
  if (m_props.axis == "y")
  {
    axis.SetY(m_sectionHeight);
  }
  if (m_props.axis == "z")
  {
    axis.SetZ(m_sectionHeight);
  }

  BRepPrimAPI_MakePrism prism(m_profile, axis);

  m_section = prism;

  m_profileChanged = false;
  m_axisChanged = false;
  m_heightChanged = false;

  m_sectionChanged = true;
  timer2.end();
}

void PrismNode::computeShape()
{
  computeSection();

  if (m_sectionChanged)
  {
    shape = m_section;
    m_sectionChanged = false;
  }
  else if (m_heightChanged)
  {
    PerformanceTimer timer("Compute scaled prism");
    gp_Vec direction;
    if (m_props.axis == "x")
    {
      direction.SetX(1);
    }
    if (m_props.axis == "y")
    {
      direction.SetY(1);
    }
    if (m_props.axis == "z")
    {
      direction.SetZ(1);
    }

    gp_Pnt center(0, 0, 0);
    gp_Ax2 axis(center, direction);
    gp_GTrsf affinity;
    affinity.SetAffinity(axis, m_props.height / m_sectionHeight);

    BRepBuilderAPI_GTransform aBRepGTrsf(m_section, affinity, Standard_False);
    shape = aBRepGTrsf.Shape();
    m_heightChanged = false;
    timer.end();
  }
}
