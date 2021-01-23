#include <BRepPrimAPI_MakeCylinder.hxx>

#include "CylinderFactory.h"

CylinderFactory::CylinderFactory() : radius(1), height(1)
{
}

CylinderFactory::~CylinderFactory()
{
}

void CylinderFactory::setProps(const emscripten::val &props)
{
  emscripten::val prop = props["radius"];
  if (isType(prop, "number"))
  {
    Standard_Real newRadius = prop.as<Standard_Real>();
    if (newRadius > 0)
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

TopoDS_Shape CylinderFactory::render()
{
  BRepPrimAPI_MakeCylinder cylinder(radius, height);
  return cylinder.Solid();
}
