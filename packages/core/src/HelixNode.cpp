#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <GCE2d_MakeSegment.hxx>
#include <Geom_CylindricalSurface.hxx>
#include <Message.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <TopoDS_Shape.hxx>
#include <gp_Lin2d.hxx>

#include "HelixNode.hpp"

#include "PerformanceTimer.hpp"
#include "operations.hpp"

HelixNode::HelixNode() : m_pitch(10), m_height(10)
{
}

void HelixNode::setPitch(Standard_Real pitch)
{
  if (!IsEqual(pitch, m_pitch))
  {
    m_pitch = pitch;
    propsChanged();
  }
}

void HelixNode::setHeight(Standard_Real height)
{
  if (!IsEqual(height, m_height))
  {
    m_height = height;
    propsChanged();
  }
}

void HelixNode::buildSpineAndGuide()
{
  BRepBuilderAPI_MakeEdge edge(gp_Pnt(0, 0, 0), gp_Pnt(0, 0, m_height));
  BRepBuilderAPI_MakeWire makeSpine(edge);
  m_spine = makeSpine;

  Standard_Real radius = 1.0;
  Standard_Real circumference = 2 * M_PI * radius;
  Standard_Real length = m_height * sqrt((m_pitch * m_pitch) + (circumference * circumference));

  gp_Lin2d aLine2d(gp_Pnt2d(0.0, 0.0), gp_Dir2d(circumference, m_pitch));
  Handle_Geom2d_TrimmedCurve aSegment = GCE2d_MakeSegment(aLine2d, 0.0, length);

  Handle_Geom_CylindricalSurface aCylinder = new Geom_CylindricalSurface(gp::XOY(), radius);
  TopoDS_Edge aHelixEdge = BRepBuilderAPI_MakeEdge(aSegment, aCylinder, 0.0, length);
  BRepLib::BuildCurve3d(aHelixEdge);

  BRepBuilderAPI_MakeWire makeGuide(aHelixEdge);
  m_guide = makeGuide;
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

void HelixNode::computeShape(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate helix");
#endif
  buildSpineAndGuide();

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Faces;
  int nbFaces = 0;
  for (Faces.Init(m_profile, TopAbs_FACE); Faces.More(); Faces.Next())
  {
    ++nbFaces;
  }

  Message_ProgressScope scope(theRange, "Computing helix", nbFaces);

  for (Faces.ReInit(); Faces.More() && scope.More(); Faces.Next())
  {
    TopoDS_Face face = TopoDS::Face(Faces.Current());

    TopExp_Explorer Wires;
    int nbWires = 0;
    for (Wires.Init(face, TopAbs_WIRE); Wires.More(); Wires.Next())
    {
      ++nbWires;
    }

    Message_ProgressScope faceScope(scope.Next(), "Computing helix component", nbWires * 2);

    TopoDS_Wire outerWire = BRepTools::OuterWire(face);
    TopoDS_Shape solid = makeHelix(outerWire);

    faceScope.Next();

    TopTools_ListOfShape holes;

    for (Wires.ReInit(); Wires.More() && faceScope.More(); Wires.Next())
    {
      TopoDS_Wire wire = TopoDS::Wire(Wires.Current());
      if (wire.IsEqual(outerWire))
      {
        continue;
      }
      holes.Append(makeHelix(wire));
      faceScope.Next();
    }

    TopoDS_Shape helix = differenceOp(solid, holes, faceScope.Next(nbWires));
    builder.Add(compound, helix);
  }

  shape = compound;
#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
