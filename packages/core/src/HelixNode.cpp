#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeSolid.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepBuilderAPI_Sewing.hxx>
#include <BRepBuilderAPI_Transform.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <GCE2d_MakeSegment.hxx>
#include <Geom_CylindricalSurface.hxx>
#include <Message.hxx>
#include <ShapeFix_Shell.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <TopoDS_Shape.hxx>
#include <gp_Lin2d.hxx>
#include <gp_Quaternion.hxx>

#include "HelixNode.hpp"

#include "BooleanOperation.hpp"
#include "PerformanceTimer.hpp"

HelixNode::HelixNode() : m_pitch(10), m_height(10), m_leftHanded(Standard_False)
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

void HelixNode::setLeftHanded(Standard_Boolean leftHanded)
{
  if (leftHanded != m_leftHanded)
  {
    m_leftHanded = leftHanded;
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

  gp_Ax3 position(gp::Origin(), gp::DZ(), gp::DX());
  if (!m_leftHanded)
  {
    position.XReverse();
  }
  Handle_Geom_CylindricalSurface aCylinder = new Geom_CylindricalSurface(position, radius);
  TopoDS_Edge aHelixEdge = BRepBuilderAPI_MakeEdge(aSegment, aCylinder, 0.0, length);
  BRepLib::BuildCurve3d(aHelixEdge);

  BRepBuilderAPI_MakeWire makeGuide(aHelixEdge);
  m_guide = makeGuide;
}

void HelixNode::computeShape(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Calculate helix");
#endif
  setShape(TopoDS_Shape());

  buildSpineAndGuide();

  BRep_Builder builder;
  TopoDS_Compound compound;
  builder.MakeCompound(compound);

  TopExp_Explorer Faces;
  int nbFaces = 0;
  for (Faces.Init(m_childShape, TopAbs_FACE); Faces.More(); Faces.Next())
  {
    ++nbFaces;
  }

  Message_ProgressScope scope(handler, "Computing helix", nbFaces);

  int faceId = -1;
  for (Faces.ReInit(); Faces.More() && scope.More(); Faces.Next())
  {
    ++faceId;
    TopoDS_Face face = TopoDS::Face(Faces.Current());

    TopExp_Explorer Wires;
    int nbWires = 0;
    for (Wires.Init(face, TopAbs_WIRE); Wires.More(); Wires.Next())
    {
      ++nbWires;
    }

    Message_ProgressScope faceScope(scope.Next(), "Computing helix component", nbWires + 1);

    gp_Trsf topTransform;
    topTransform.SetTranslationPart(gp_Vec(0, 0, m_height));
    topTransform.SetRotationPart(gp_Quaternion(gp::DZ(), 2 * M_PI * m_height / m_pitch * (m_leftHanded ? 1 : -1)));
    BRepBuilderAPI_Transform topTransformBuilder(topTransform);
    topTransformBuilder.Perform(face, true);
    TopoDS_Shape topFace = topTransformBuilder.Shape();

    BRepBuilderAPI_Sewing solid;
    solid.Init(1e-5);
    solid.Add(face);
    solid.Add(topFace);

    int wireId = -1;
    for (Wires.ReInit(); Wires.More() && faceScope.More(); Wires.Next())
    {
      ++wireId;

      TopoDS_Wire wire = TopoDS::Wire(Wires.Current());

      BRepOffsetAPI_MakePipeShell pipe(m_spine);
      pipe.SetMode(m_guide, false);
      pipe.Add(wire);

      pipe.Build();
      if (pipe.IsDone())
      {
        solid.Add(pipe.Shape());
      }
      else
      {
        handler.Abort("helix: could not make helix for wire " + std::to_string(wireId) + " of face " +
                      std::to_string(faceId));
        continue;
      }
    }

    if (!faceScope.More())
    {
      continue;
    }

    PerformanceTimer timer2("Helix sew");
    solid.Perform();
    TopoDS_Shell sewedShape = TopoDS::Shell(solid.SewedShape());

    ShapeFix_Shell fixShell(sewedShape);
    fixShell.Perform(handler.WithRange(faceScope.Next()));
    TopoDS_Shell shell = fixShell.Shell();

    BRepBuilderAPI_MakeSolid makeSolid;
    makeSolid.Add(shell);
    makeSolid.Build();
    TopoDS_Solid shape = makeSolid.Solid();

    BRepLib::OrientClosedSolid(shape);

    builder.Add(compound, shape);

    timer2.end();
  }

  if (scope.More())
  {
    setShape(compound);
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
