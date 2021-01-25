#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <GCE2d_MakeSegment.hxx>
#include <Geom_CylindricalSurface.hxx>
#include <Message.hxx>
#include <Message_Messenger.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <gp_Lin2d.hxx>

#include <math.h>

#include "HelixFactory.h"

HelixFactory::HelixFactory() : radius(1), height(1)
{
}

HelixFactory::~HelixFactory()
{
}

void HelixFactory::setProps(const emscripten::val &props)
{
  emscripten::val prop = props["radius"];
  if (isType(prop, "number"))
  {
    Standard_Real newRadius = prop.as<Standard_Real>();
    if (newRadius >= 0)
    {
      radius = newRadius;
    }
  }

  prop = props["height"];
  if (isType(prop, "number"))
  {
    Standard_Real newHeight = prop.as<Standard_Real>();
    if (newHeight > 0)
    {
      height = newHeight;
    }
  }
}

TopoDS_Shape HelixFactory::render()
{
  Standard_Real length = height * sqrt(pow(M_PI * 2.0, 2) * 2);
  Handle_Geom_CylindricalSurface aCylinder = new Geom_CylindricalSurface(gp::XOY(), radius);
  gp_Lin2d aLine2d(gp_Pnt2d(0.0, 0.0), gp_Dir2d(1.0, 0.5));
  Handle_Geom2d_TrimmedCurve aSegment = GCE2d_MakeSegment(aLine2d, 0.0, length);
  TopoDS_Edge aHelixEdge = BRepBuilderAPI_MakeEdge(aSegment, aCylinder, 0.0, length).Edge();
  BRepLib::BuildCurve3d(aHelixEdge);

  BRepBuilderAPI_MakeEdge edge(gp_Pnt(0, 0, 0), gp_Pnt(0, 0, height));
  BRepBuilderAPI_MakeWire wire1(edge);
  BRepBuilderAPI_MakeWire wire(aHelixEdge);

  // BRepBuilderAPI_MakePolygon polygon(gp_Pnt(1, 0, 0), gp_Pnt(1, 0, 1), gp_Pnt(2, 0, 1), gp_Pnt(2, 0, 0), true);
  BRepBuilderAPI_MakePolygon polygon(gp_Pnt(-1, -1, 0), gp_Pnt(-1, 1, 0), gp_Pnt(1, 1, 0), gp_Pnt(1, -1, 0), true);
  BRepBuilderAPI_MakeFace face(polygon.Wire());

  BRepOffsetAPI_MakePipeShell pipe(wire1);
  pipe.SetMode(wire, false);
  pipe.Add(polygon);
  pipe.Build();
  pipe.MakeSolid();

  return pipe.Shape();
  // return w;
}
