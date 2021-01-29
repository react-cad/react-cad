#ifndef SweepFactory_HeaderFile
#define SweepFactory_HeaderFile

#include "ReactCADShapeFactory.h"

#include <TopoDS_Wire.hxx>

class SweepFactory : public ReactCADShapeFactory
{
public:
  SweepFactory();
  virtual ~SweepFactory();

protected:
  TopoDS_Wire profile;
};

#endif
