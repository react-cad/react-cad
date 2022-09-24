#ifndef ReactCADNode_HeaderFile
#define ReactCADNode_HeaderFile

#include <functional>
#include <memory>
#include <vector>

#include <Standard_Transient.hxx>
#include <TopTools_ListOfShape.hxx>
#include <TopoDS_Shape.hxx>

#include <emscripten/bind.h>

#include <pthread.h>

//! Sample class creating 3D Viewer within Emscripten canvas.
class ReactCADNode : public Standard_Transient
{
public:
  ReactCADNode();
  virtual ~ReactCADNode();

  void appendChild(Handle(ReactCADNode) & child);
  void insertChildBefore(Handle(ReactCADNode) & child, const Handle(ReactCADNode) & before);
  void removeChild(Handle(ReactCADNode) & child);
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

  bool doubleEquals(double a, double b);

private:
  Handle(ReactCADNode) m_parent;
  std::vector<Handle(ReactCADNode)> m_children;
  static pthread_mutex_t nodeMutex;

  bool m_propsChanged;
  bool m_childrenChanged;
  void notifyAncestors();
};

#endif // ReactCADNode_HeaderFile
