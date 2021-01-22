#include <BRepPrimAPI_MakeSphere.hxx>

#include "SphereFactory.h"
#include <Message.hxx>
#include <Message_Messenger.hxx>

SphereFactory::SphereFactory() : radius(1)
{
}

SphereFactory::~SphereFactory()
{
}

void SphereFactory::setProps(const emscripten::val &props)
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
}

TopoDS_Shape SphereFactory::render()
{
  BRepPrimAPI_MakeSphere sphere(radius);
  return sphere.Solid();
}
