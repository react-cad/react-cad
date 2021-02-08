#include <BRepBuilderAPI_GTransform.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepPrimAPI_MakePrism.hxx>

#include <gp_Ax2.hxx>
#include <gp_GTrsf.hxx>

#include "PerformanceTimer.hpp"
#include "PrismNode.hpp"
#include "operations.hpp"

PrismNode::PrismNode() : m_props({.axis = "z", .height = 1}), m_sectionHeight(1)
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

void PrismNode::computeSection()
{
  PerformanceTimer timer1("Compute profile");
  makeProfile();
  timer1.end();

  if (m_profileChanged || m_axisChanged)
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

    BRep_Builder builder;
    TopoDS_Compound compound;
    builder.MakeCompound(compound);

    std::vector<ShapeWires>::iterator it;
    for (it = wires.begin(); it != wires.end(); ++it)
    {
      BRep_Builder positiveBuilder;
      TopoDS_Compound positiveCompound;
      positiveBuilder.MakeCompound(positiveCompound);

      BRep_Builder negativeBuilder;
      TopoDS_Compound negativeCompound;
      negativeBuilder.MakeCompound(negativeCompound);

      for (std::vector<TopoDS_Wire>::iterator pos = it->first.begin(); pos != it->first.end(); ++pos)
      {
        BRepBuilderAPI_MakeFace face(*pos);
        positiveBuilder.Add(positiveCompound, face);
      }
      BRepPrimAPI_MakePrism prism(positiveCompound, axis);

      if (it->second.size() == 0)
      {
        builder.Add(compound, prism);
      }
      else
      {
        for (std::vector<TopoDS_Wire>::iterator neg = it->second.begin(); neg != it->second.end(); ++neg)
        {
          BRepBuilderAPI_MakeFace face(*neg);
          negativeBuilder.Add(negativeCompound, face);
        }
        BRepPrimAPI_MakePrism negativePrism(negativeCompound, axis);
        builder.Add(compound, differenceOp(prism, negativePrism));
      }
    }

    m_section = compound;

    m_profileChanged = false;
    m_axisChanged = false;
    m_heightChanged = false;

    m_sectionChanged = true;
    timer2.end();
  }
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
