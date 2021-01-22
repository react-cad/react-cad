#ifndef ReactCADShapeFactory_HeaderFile
#define ReactCADShapeFactory_HeaderFile

#include <functional>
#include <memory>
#include <string>
#include <vector>

#include <TopoDS_Shape.hxx>

#include <emscripten.h>
#include <emscripten/bind.h>

class ReactCADShapeFactory
{
public:
  ReactCADShapeFactory();
  virtual ~ReactCADShapeFactory();
  virtual void setProps(const emscripten::val &newProps);
  virtual void renderChildren(const std::vector<TopoDS_Shape> &children);
  virtual TopoDS_Shape render();

protected:
  bool isType(const emscripten::val &value, const std::string &type);
  TopoDS_Shape fuse(const std::vector<TopoDS_Shape> &children);
  TopoDS_Shape m_children;
};

#endif // ReactCADShapeFactory_HeaderFile
