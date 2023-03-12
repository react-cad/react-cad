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
  void setOrigin(gp_Pnt origin);
  void setNormal(gp_Vec normal);
  void setXDirection(gp_Vec xDirection);

  void appendSVG(Handle(SVG) & child);
  void insertSVGBefore(Handle(SVG) & child, const Handle(SVG) & before);
  void removeSVG(Handle(SVG) & child);
  void updateSVGs();

  std::string getName() override
  {
    return "Surface";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  gp_Pnt m_origin;
  gp_Dir m_normal;
  gp_Dir m_xDirection;
  Standard_Boolean m_planeChanged;

  std::vector<Handle(SVG)> m_children;
  Handle(Geom_Plane) m_surface;
};

#endif
