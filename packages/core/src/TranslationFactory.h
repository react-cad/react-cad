#ifndef TranslationFactory_HeaderFile
#define TranslationFactory_HeaderFile

#include "TransformationFactory.h"

class TranslationFactory : public TransformationFactory
{
public:
  TranslationFactory();
  virtual ~TranslationFactory();
  void setProps(const emscripten::val &newProps);
};

#endif
