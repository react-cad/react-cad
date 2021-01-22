#include <BRepPrimAPI_MakeBox.hxx>

#include "BoxFactory.h"

BoxFactory::BoxFactory() : x(1), y(1), z(1)
{
}

BoxFactory::~BoxFactory()
{
}

void BoxFactory::setProps(const emscripten::val &props)
{
  emscripten::val prop = props["x"];
  if (isType(prop, "number"))
  {
    Standard_Real newX = prop.as<Standard_Real>();
    if (newX > 0)
    {
      x = newX;
    }
  }

  prop = props["y"];
  if (isType(prop, "number"))
  {
    Standard_Real newY = prop.as<Standard_Real>();
    if (newY > 0)
    {
      y = newY;
    }
  }

  prop = props["z"];
  if (isType(prop, "number"))
  {
    Standard_Real newZ = prop.as<Standard_Real>();
    if (newZ > 0)
    {
      z = newZ;
    }
  }
}

TopoDS_Shape BoxFactory::render()
{
  BRepPrimAPI_MakeBox box(x, y, z);
  return box.Solid();
}
