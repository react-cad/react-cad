#ifndef RotationFactory_HeaderFile
#define RotationFactory_HeaderFile

#include "TransformationFactory.h"

class RotationFactory : public TransformationFactory
{
public:
  RotationFactory();
  virtual ~RotationFactory();
  void setProps(const emscripten::val &newProps);
};

#endif
