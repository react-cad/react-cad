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

struct MatrixRow
{
  Standard_Real a1;
  Standard_Real a2;
  Standard_Real a3;
  Standard_Real a4;
};

struct Matrix
{
  MatrixRow a1;
  MatrixRow a2;
  MatrixRow a3;
  MatrixRow a4;
};

#endif
