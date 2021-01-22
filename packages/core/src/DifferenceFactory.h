#ifndef DifferenceFactory_HeaderFile
#define DifferenceFactory_HeaderFile

#include "ReactCADShapeFactory.h"

class DifferenceFactory : public ReactCADShapeFactory
{
public:
  DifferenceFactory();
  virtual ~DifferenceFactory();
  void renderChildren(const std::vector<TopoDS_Shape> &children);

private:
  TopoDS_Shape cut(const std::vector<TopoDS_Shape> &children);
};

#endif
