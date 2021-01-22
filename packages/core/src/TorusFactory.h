#ifndef TorusFactory_HeaderFile
#define TorusFactory_HeaderFile

#include "ReactCADShapeFactory.h"

class TorusFactory : public ReactCADShapeFactory
{
public:
  TorusFactory();
  virtual ~TorusFactory();
  void setProps(const emscripten::val &newProps);
  TopoDS_Shape render();

private:
  Standard_Real radius1;
  Standard_Real radius2;
};

#endif
