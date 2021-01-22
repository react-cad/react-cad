#include "TranslationFactory.h"

TranslationFactory::TranslationFactory()
{
}

TranslationFactory::~TranslationFactory()
{
}

void TranslationFactory::setProps(const emscripten::val &props)
{
  gp_Vec translation;

  emscripten::val prop = props["x"];
  if (isType(prop, "number"))
  {
    translation.SetX(prop.as<Standard_Real>());
  }

  prop = props["y"];
  if (isType(prop, "number"))
  {
    translation.SetY(prop.as<Standard_Real>());
  }

  prop = props["z"];
  if (isType(prop, "number"))
  {
    translation.SetZ(prop.as<Standard_Real>());
  }

  transform.SetTranslation(translation);
}
