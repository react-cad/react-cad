#ifndef SphericalSurfaceNode_HeaderFile
#define SphericalSurfaceNode_HeaderFile

#include "SurfaceNode.hpp"

#include <Geom_SphericalSurface.hxx>

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
  Handle(Geom_Surface) getSurface() override;
  gp_GTrsf2d getTransform() override;

private:
  gp_Pnt m_origin;
  Standard_Real m_radius;
  Standard_Boolean m_surfaceChanged;

  Handle(Geom_SphericalSurface) m_surface;
  gp_GTrsf2d m_transform;
};

#endif
