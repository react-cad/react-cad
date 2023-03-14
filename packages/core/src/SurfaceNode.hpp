#ifndef SurfaceNode_HeaderFile
#define SurfaceNode_HeaderFile

#include "ReactCADNode.hpp"
#include "SVG.hpp"

#include <Geom_Plane.hxx>
#include <gp_Dir.hxx>
#include <gp_Pnt.hxx>
#include <gp_Vec.hxx>

class SurfaceNode : public ReactCADNode
{
public:
  SurfaceNode();

  void appendSVG(Handle(SVG) & child);
  void insertSVGBefore(Handle(SVG) & child, const Handle(SVG) & before);
  void removeSVG(Handle(SVG) & child);
  void updateSVGs();

protected:
  void computeShape(const ProgressHandler &handler) override;
  virtual Handle(Geom_Surface) getSurface(const ProgressHandler &handler) = 0;

private:
  std::vector<Handle(SVG)> m_children;
};

#endif
