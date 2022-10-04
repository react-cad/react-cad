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

  bool computeGeometry(const Message_ProgressRange &theRange = Message_ProgressRange());
  TopoDS_Shape shape;

protected:
  void propsChanged();

  virtual void computeChildren(TopTools_ListOfShape children,
                               const Message_ProgressRange &theRange = Message_ProgressRange());
  virtual void computeShape(const Message_ProgressRange &theRange = Message_ProgressRange());

  TopoDS_Shape m_childShape;

private:
  Handle(ReactCADNode) m_parent;
  std::vector<Handle(ReactCADNode)> m_children;

  bool m_propsChanged;
  bool m_childrenChanged;
  void notifyAncestors();
};

#endif // ReactCADNode_HeaderFile
