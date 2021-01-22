#ifndef BoxFactory_HeaderFile
#define BoxFactory_HeaderFile

#include "ReactCADShapeFactory.h"

class BoxFactory : public ReactCADShapeFactory
{
public:
  BoxFactory();
  virtual ~BoxFactory();
  void setProps(const emscripten::val &newProps);
  TopoDS_Shape render();

private:
  Standard_Real x;
  Standard_Real y;
  Standard_Real z;
};

#endif
