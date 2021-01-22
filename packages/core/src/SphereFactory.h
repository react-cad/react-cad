#ifndef SphereFactory_HeaderFile
#define SphereFactory_HeaderFile

#include "ReactCADShapeFactory.h"

class SphereFactory : public ReactCADShapeFactory
{
public:
  SphereFactory();
  virtual ~SphereFactory();
  void setProps(const emscripten::val &newProps);
  TopoDS_Shape render();

private:
  Standard_Real radius;
};

#endif
