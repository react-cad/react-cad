#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepPrimAPI_MakeRevol.hxx>

#include <math.h>

#include "RevolutionNode.hpp"
#include "operations.hpp"

RevolutionNode::RevolutionNode() : m_props({.axis = "z", .angle = 2 * M_PI})
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

void RevolutionNode::computeShape()
{
  makeProfile();

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

  BRepBuilderAPI_MakeFace face(wires.at(0).first.at(0));
  BRepPrimAPI_MakeRevol revolution(face, axis, angle);
  shape = revolution;

  return;

  // WIP SVG support

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
      BRepPrimAPI_MakeRevol revolution(face, axis, angle);
      shape = revolution;
      return;
      positiveBuilder.Add(positiveCompound, revolution);
    }

    if (it->second.size() == 0)
    {
      builder.Add(compound, positiveCompound);
    }
    else
    {
      for (std::vector<TopoDS_Wire>::iterator neg = it->second.begin(); neg != it->second.end(); ++neg)
      {
        BRepBuilderAPI_MakeFace face(*neg);
        BRepPrimAPI_MakeRevol negativeRevolution(face, axis, angle);
        negativeBuilder.Add(negativeCompound, negativeRevolution);
      }
      builder.Add(compound, differenceOp(positiveCompound, negativeCompound));
    }
  }

  shape = compound;
}
