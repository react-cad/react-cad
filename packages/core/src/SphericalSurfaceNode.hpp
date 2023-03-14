#ifndef SphericalSurfaceNode_HeaderFile
#define SphericalSurfaceNode_HeaderFile

#include "SurfaceNode.hpp"

#include <Geom_SphericalSurface.hxx>
#include <gp_Dir.hxx>
#include <gp_Pnt.hxx>
#include <gp_Vec.hxx>

class SphericalSurfaceNode : public SurfaceNode
{
public:
  SphericalSurfaceNode();
  void setOrigin(gp_Pnt origin);
  void setRadius(Standard_Real radius);

  std::string getName() override
  {
    return "SphericalSurface";
  }

protected:
  Handle(Geom_Surface) getSurface(const ProgressHandler &handler) override;

private:
  gp_Pnt m_origin;
  Standard_Real m_radius;
  Standard_Boolean m_surfaceChanged;

  Handle(Geom_SphericalSurface) m_surface;
};

#endif
