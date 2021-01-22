#ifndef ReactCADNode_HeaderFile
#define ReactCADNode_HeaderFile

#include <functional>
#include <memory>
#include <vector>

#include <emscripten/bind.h>

#include "ReactCADShapeFactory.h"

//! Sample class creating 3D Viewer within Emscripten canvas.
class ReactCADNode : public std::enable_shared_from_this<ReactCADNode>
{
public:
  ReactCADNode(ReactCADShapeFactory *shapeFactory);
  virtual ~ReactCADNode();

  void appendChild(std::shared_ptr<ReactCADNode> child);
  void insertChildBefore(std::shared_ptr<ReactCADNode> child, const ReactCADNode &before);
  void removeChild(ReactCADNode &child);
  bool hasParent();

  void setProps(const emscripten::val &newProps);
  void render();
  TopoDS_Shape shape;

private:
  std::shared_ptr<ReactCADNode> m_parent;
  std::vector<std::shared_ptr<ReactCADNode>> m_children;

  std::shared_ptr<ReactCADShapeFactory> m_shapeFactory;

  bool m_propsChanged;
  bool m_childrenChanged;
  void notifyAncestors();
};

#endif // ReactCADNode_HeaderFile
