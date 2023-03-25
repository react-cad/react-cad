#ifndef ReactCADNode_HeaderFile
#define ReactCADNode_HeaderFile

#include <functional>
#include <memory>
#include <vector>

#include <Message_ProgressRange.hxx>
#include <Message_ProgressScope.hxx>
#include <Standard_Transient.hxx>
#include <TopTools_ListOfShape.hxx>
#include <TopoDS_Shape.hxx>

#include <emscripten/bind.h>

#include "ProgressHandler.hpp"

//! Sample class creating 3D Viewer within Emscripten canvas.
class ReactCADNode : public Standard_Transient
{
public:
  ReactCADNode();
  virtual ~ReactCADNode();

  TopoDS_Shape getShape(const ProgressHandler &handler);
  void appendChild(Handle(ReactCADNode) & child);
  void insertChildBefore(Handle(ReactCADNode) & child, const Handle(ReactCADNode) & before);
  void removeChild(Handle(ReactCADNode) & child);
  bool hasParent();

  void computeGeometry(const ProgressHandler &handler);
  virtual std::string getName() = 0;

protected:
  void setShape(const TopoDS_Shape &shape);
  void propsChanged();

  virtual void computeChildren(TopTools_ListOfShape children, const ProgressHandler &handler);
  virtual void computeShape(const ProgressHandler &handler);

  TopoDS_Shape m_childShape;

private:
  TopoDS_Shape m_shape;
  Handle(ReactCADNode) m_parent;
  std::vector<Handle(ReactCADNode)> m_children;

  bool m_propsChanged;
  bool m_childrenChanged;
  void notifyAncestors();
};

#endif // ReactCADNode_HeaderFile
