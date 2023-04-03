#ifndef ReactCADShape_HeaderFile
#define ReactCADShape_HeaderFile

#include <Standard_Transient.hxx>
#include <TopoDS_Shape.hxx>

class ReactCADShape : public Standard_Transient
{
public:
  ReactCADShape(TopoDS_Shape shape) : m_shape(shape){};
  TopoDS_Shape getShape()
  {
    return m_shape;
  };

private:
  TopoDS_Shape m_shape;
};

#endif // ReactCADShape_HeaderFile
