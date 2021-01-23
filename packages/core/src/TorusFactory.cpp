#include <BRepPrimAPI_MakeTorus.hxx>

#include "TorusFactory.h"

TorusFactory::TorusFactory() : radius1(1), radius2(1)
{
}

TorusFactory::~TorusFactory()
{
}

void TorusFactory::setProps(const emscripten::val &props)
{
  emscripten::val prop = props["radius1"];
  if (isType(prop, "number"))
  {
    Standard_Real newRadius1 = prop.as<Standard_Real>();
    if (newRadius1 > 0)
    {
      radius1 = newRadius1;
    }
  }

  prop = props["radius2"];
  if (isType(prop, "number"))
  {
    Standard_Real newRadius2 = prop.as<Standard_Real>();
    if (newRadius2 > 0)
    {
      radius2 = newRadius2;
    }
  }
}

TopoDS_Shape TorusFactory::render()
{
  BRepPrimAPI_MakeTorus torus(radius1, radius2);
  return torus.Solid();
}
