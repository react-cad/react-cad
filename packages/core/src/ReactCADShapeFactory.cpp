#include "ReactCADShapeFactory.h"

#include <BRepAlgoAPI_BuilderAlgo.hxx>

ReactCADShapeFactory::ReactCADShapeFactory() : m_children(TopoDS_Shape())
{
}

ReactCADShapeFactory::~ReactCADShapeFactory()
{
}

void ReactCADShapeFactory::setProps(const emscripten::val &newProps)
{
}

void ReactCADShapeFactory::renderChildren(const std::vector<TopoDS_Shape> &children)
{
  m_children = fuse(children);
}

TopoDS_Shape ReactCADShapeFactory::render()
{
  return m_children;
}

bool ReactCADShapeFactory::isType(const emscripten::val &value, const std::string &type)
{
  std::string valType = value.typeOf().as<std::string>();
  return valType == type;
}

TopoDS_Shape ReactCADShapeFactory::fuse(const std::vector<TopoDS_Shape> &children)
{
  switch (children.size())
  {
  case 0:
    return TopoDS_Shape();
  case 1:
    return children[0];
  default: {
    BRepAlgoAPI_BuilderAlgo aBuilder;

    TopTools_ListOfShape aLS;
    for (TopoDS_Shape shape : children)
    {
      aLS.Append(shape);
    }

    aBuilder.SetArguments(aLS);

    aBuilder.Build();
    if (aBuilder.HasErrors())
    {
      TopoDS_Shape nullShape;
      return nullShape;
    }
    return aBuilder.Shape();
  }
  }
}
