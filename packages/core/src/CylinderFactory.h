#ifndef CylinderFactory_HeaderFile
#define CylinderFactory_HeaderFile

#include "ReactCADShapeFactory.h"

class CylinderFactory : public ReactCADShapeFactory
{
public:
  CylinderFactory();
  virtual ~CylinderFactory();
  void setProps(const emscripten::val &newProps);
  TopoDS_Shape render();

private:
  Standard_Real radius;
  Standard_Real height;
};

#endif
