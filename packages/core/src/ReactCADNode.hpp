#ifndef ReactCADNode_HeaderFile
#define ReactCADNode_HeaderFile

#include <functional>
#include <memory>
#include <vector>

#include <TopTools_ListOfShape.hxx>
#include <TopoDS_Shape.hxx>

#include <emscripten/bind.h>

#include <pthread.h>

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

  static void initializeMutex();
  static void lock();
  static void unlock();

  bool computeGeometry();
  TopoDS_Shape shape;

protected:
  void propsChanged();

  virtual void computeChildren(TopTools_ListOfShape children);
  virtual void computeShape();

  TopoDS_Shape m_childShape;

  bool isType(const emscripten::val &value, const std::string &type);
  bool doubleEquals(double a, double b);

private:
  std::shared_ptr<ReactCADNode> m_parent;
  std::vector<std::shared_ptr<ReactCADNode>> m_children;
  static pthread_mutex_t nodeMutex;

  bool m_propsChanged;
  bool m_childrenChanged;
  void notifyAncestors();
};

#endif // ReactCADNode_HeaderFile
