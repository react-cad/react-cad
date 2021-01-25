#ifndef ReactCADNode_HeaderFile
#define ReactCADNode_HeaderFile

#include <functional>
#include <memory>
#include <vector>

#include <TopoDS_Shape.hxx>

#include <emscripten/bind.h>

//! Sample class creating 3D Viewer within Emscripten canvas.
class ReactCADNode : public std::enable_shared_from_this<ReactCADNode>
{
public:
  ReactCADNode();
  virtual ~ReactCADNode();

  void appendChild(std::shared_ptr<ReactCADNode> child);
  void insertChildBefore(std::shared_ptr<ReactCADNode> child, const ReactCADNode &before);
  void removeChild(ReactCADNode &child);
  bool hasParent();

  void renderTree();
  TopoDS_Shape shape;

protected:
  void propsChanged();

  virtual void renderChildren(const std::vector<TopoDS_Shape> &children);
  virtual void renderShape();

  TopoDS_Shape fuse(const std::vector<TopoDS_Shape> &children);
  TopoDS_Shape m_childShape;

  bool isType(const emscripten::val &value, const std::string &type);
  bool doubleEquals(double a, double b);

private:
  std::shared_ptr<ReactCADNode> m_parent;
  std::vector<std::shared_ptr<ReactCADNode>> m_children;

  bool m_propsChanged;
  bool m_childrenChanged;
  void notifyAncestors();
};

#endif // ReactCADNode_HeaderFile
