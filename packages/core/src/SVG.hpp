#ifndef SVG_Headerfile
#define SVG_Headerfile

#include <string>

#include <Geom_Surface.hxx>
#include <Standard_Handle.hxx>
#include <TopoDS_Shape.hxx>

#include "ProgressHandler.hpp"
#include "ReactCADNode.hpp"

class SurfaceNode;

class SVG : public Standard_Transient
{
public:
  SVG();
  void setParent(const Handle(SurfaceNode) & parent);
  void setSource(const std::string &svg);
  void SetSurface(const Handle(Geom_Surface) & surface);
  void Build(const ProgressHandler &handler);
  TopoDS_Shape Shape(const ProgressHandler &handler);
  bool IsDone()
  {
    return m_done;
  }

private:
  TopoDS_Shape m_shape;
  Handle(SurfaceNode) m_parent;
  std::string m_svg;
  Handle(Geom_Surface) m_surface;
  bool m_done = false;
};

#endif
