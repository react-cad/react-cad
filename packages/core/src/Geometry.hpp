#ifndef Geometry_HeaderFile
#define Geometry_HeaderFile

#include <Standard_TypeDef.hxx>

struct Point
{
  Standard_Real x;
  Standard_Real y;
  Standard_Real z;
};

typedef Point Vector;

struct Quaternion
{
  Standard_Real x;
  Standard_Real y;
  Standard_Real z;
  Standard_Real w;
};

#endif
