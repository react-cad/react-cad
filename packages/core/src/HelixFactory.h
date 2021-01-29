#ifndef HelixFactory_HeaderFile
#define HelixFactory_HeaderFile

#include "SweepFactory.h"

class HelixFactory : public SweepFactory
{
public:
  HelixFactory();
  virtual ~HelixFactory();
  void setProps(const emscripten::val &newProps);
  TopoDS_Shape render();

private:
  Standard_Real pitch;
  Standard_Real height;
};

#endif
