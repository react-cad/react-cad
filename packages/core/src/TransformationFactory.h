#ifndef TransformationFactory_HeaderFile
#define TransformationFactory_HeaderFile

#include "ReactCADShapeFactory.h"

#include <gp.hxx>
#include <gp_Trsf.hxx>

class TransformationFactory : public ReactCADShapeFactory
{
public:
  TransformationFactory();
  virtual ~TransformationFactory();
  TopoDS_Shape render();

protected:
  gp_Trsf transform;
};

#endif
