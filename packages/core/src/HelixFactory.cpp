#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRepOffsetAPI_MakePipeShell.hxx>
#include <GCE2d_MakeSegment.hxx>
#include <Geom_CylindricalSurface.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Face.hxx>
#include <gp_Lin2d.hxx>

#include <math.h>

#include "HelixFactory.h"

HelixFactory::HelixFactory() : pitch(1), height(1)
{
  profile = BRepBuilderAPI_MakePolygon(gp_Pnt(-1, -1, 0), gp_Pnt(-1, 1, 0), gp_Pnt(1, 1, 0), gp_Pnt(1, -1, 0), true);
}

HelixFactory::~HelixFactory()
{
}

void HelixFactory::setProps(const emscripten::val &props)
{
  emscripten::val prop = props["height"];
  if (isType(prop, "number"))
  {
    Standard_Real newHeight = prop.as<Standard_Real>();
    if (newHeight > 0)
    {
      height = newHeight;
    }
  }

  prop = props["pitch"];
  if (isType(prop, "number"))
  {
    Standard_Real newPitch = prop.as<Standard_Real>();
    if (newPitch >= 0)
    {
      pitch = newPitch;
    }
  }
}

TopoDS_Shape HelixFactory::render()
{
  BRepBuilderAPI_MakeEdge edge(gp_Pnt(0, 0, 0), gp_Pnt(0, 0, height));
  BRepBuilderAPI_MakeWire spine(edge);

  Standard_Real radius = 1.0;
  Standard_Real circumference = 2 * M_PI * radius;
  Standard_Real length = height * sqrt((pitch * pitch) + (circumference * circumference));

  gp_Lin2d aLine2d(gp_Pnt2d(0.0, 0.0), gp_Dir2d(circumference, pitch));
  Handle_Geom2d_TrimmedCurve aSegment = GCE2d_MakeSegment(aLine2d, 0.0, length);

  Handle_Geom_CylindricalSurface aCylinder = new Geom_CylindricalSurface(gp::XOY(), radius);
  TopoDS_Edge aHelixEdge = BRepBuilderAPI_MakeEdge(aSegment, aCylinder, 0.0, length);
  BRepLib::BuildCurve3d(aHelixEdge);

  BRepBuilderAPI_MakeWire guide(aHelixEdge);

  BRepOffsetAPI_MakePipeShell pipe(spine);
  pipe.SetMode(guide, false);
  pipe.Add(profile);
  pipe.Build();
  pipe.MakeSolid();

  return pipe.Shape();
}
