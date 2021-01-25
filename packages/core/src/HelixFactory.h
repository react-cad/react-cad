#ifndef HelixFactory_HeaderFile
#define HelixFactory_HeaderFile

#include "ReactCADShapeFactory.h"

class HelixFactory : public ReactCADShapeFactory
{
public:
  HelixFactory();
  virtual ~HelixFactory();
  void setProps(const emscripten::val &newProps);
  TopoDS_Shape render();

private:
  Standard_Real radius;
  Standard_Real height;
};

#endif
