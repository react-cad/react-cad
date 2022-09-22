#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <GCE2d_MakeSegment.hxx>
#include <Geom_CylindricalSurface.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <gp_Lin2d.hxx>

#include <math.h>

#include "HelixNode.hpp"

#include "PerformanceTimer.hpp"
#include "operations.hpp"

#include "SVGBuilder.hpp"
#include "SVGImage.hpp"

HelixNode::HelixNode() : m_props({.pitch = 0, .height = 0}), m_profile()
{
  setProps({.pitch = 1, .height = 1});
}

HelixNode::~HelixNode()
{
}

void HelixNode::setProps(const HelixProps &props)
{
  if (!doubleEquals(props.pitch, m_props.pitch) || !doubleEquals(props.height, m_props.height))
  {
    m_props = props;

    BRepBuilderAPI_MakeEdge edge(gp_Pnt(0, 0, 0), gp_Pnt(0, 0, m_props.height));
    BRepBuilderAPI_MakeWire makeSpine(edge);
    m_spine = makeSpine;

    Standard_Real radius = 1.0;
    Standard_Real circumference = 2 * M_PI * radius;
    Standard_Real length = m_props.height * sqrt((m_props.pitch * m_props.pitch) + (circumference * circumference));

    gp_Lin2d aLine2d(gp_Pnt2d(0.0, 0.0), gp_Dir2d(circumference, m_props.pitch));
    Handle_Geom2d_TrimmedCurve aSegment = GCE2d_MakeSegment(aLine2d, 0.0, length);

    Handle_Geom_CylindricalSurface aCylinder = new Geom_CylindricalSurface(gp::XOY(), radius);
    TopoDS_Edge aHelixEdge = BRepBuilderAPI_MakeEdge(aSegment, aCylinder, 0.0, length);
    BRepLib::BuildCurve3d(aHelixEdge);

    BRepBuilderAPI_MakeWire makeGuide(aHelixEdge);
    m_guide = makeGuide;

    propsChanged();
  }
}

void HelixNode::setProfile(const std::vector<Point> &points)
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
}

void HelixNode::setProfileSVG(const std::string &svg)
{
  PerformanceTimer timer1("Compute profile");
  Handle(SVGImage) image = new SVGImage(svg);
  SVGBuilder builder(image);
  m_profile = builder.Shape();
  propsChanged();
  timer1.end();
}

TopoDS_Shape HelixNode::makeHelix(const TopoDS_Wire &profile)
{
  BRepOffsetAPI_MakePipeShell pipe(m_spine);
  pipe.SetMode(m_guide, false);
  pipe.Add(profile);

  pipe.Build();
  pipe.MakeSolid();

  return pipe;
}

void HelixNode::computeShape()
{
  PerformanceTimer timer("Calculate helix");

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Faces;
  for (Faces.Init(m_profile, TopAbs_FACE); Faces.More(); Faces.Next())
  {
    TopoDS_Face face = TopoDS::Face(Faces.Current());
    TopoDS_Wire outerWire = BRepTools::OuterWire(face);

    TopoDS_Shape solid = makeHelix(outerWire);

    TopTools_ListOfShape holes;

    TopExp_Explorer Wires;
    for (Wires.Init(face, TopAbs_WIRE); Wires.More(); Wires.Next())
    {
      TopoDS_Wire wire = TopoDS::Wire(Wires.Current());
      if (wire.IsEqual(outerWire))
      {
        continue;
      }
      holes.Append(makeHelix(wire));
    }

    TopoDS_Shape helix = differenceOp(solid, holes);
    builder.Add(compound, helix);
  }

  shape = compound;
  timer.end();
}
