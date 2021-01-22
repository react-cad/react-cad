#ifndef IntersectionFactory_HeaderFile
#define IntersectionFactory_HeaderFile

#include "ReactCADShapeFactory.h"

class IntersectionFactory : public ReactCADShapeFactory
{
public:
  IntersectionFactory();
  virtual ~IntersectionFactory();
  void renderChildren(const std::vector<TopoDS_Shape> &children);

private:
  TopoDS_Shape common(const std::vector<TopoDS_Shape> &children);
};

#endif
