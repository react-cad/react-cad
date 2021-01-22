#include "RotationFactory.h"

RotationFactory::RotationFactory()
{
}

RotationFactory::~RotationFactory()
{
}

void RotationFactory::setProps(const emscripten::val &props)
{
  emscripten::val prop = props["angle"];

  if (isType(prop, "number"))
  {
    Standard_Real angle = prop.as<Standard_Real>();

    prop = props["axis"];

    if (isType(prop, "string"))
    {
      std::string axis = prop.as<std::string>();
      if (axis == "x")
      {
        transform.SetRotation(gp::OX(), angle);
      }
      if (axis == "y")
      {
        transform.SetRotation(gp::OY(), angle);
      }
      if (axis == "z")
      {
        transform.SetRotation(gp::OZ(), angle);
      }
    }
  }
}
