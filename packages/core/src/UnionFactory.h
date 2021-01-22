#ifndef UnionFactory_HeaderFile
#define UnionFactory_HeaderFile

#include "ReactCADShapeFactory.h"

class UnionFactory : public ReactCADShapeFactory
{
public:
  UnionFactory();
  virtual ~UnionFactory();
  TopoDS_Shape render();
};

#endif
