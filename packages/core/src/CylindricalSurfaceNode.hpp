#ifndef CylindricalSurfaceNode_HeaderFile
#define CylindricalSurfaceNode_HeaderFile

#include "SurfaceNode.hpp"

#include <Geom_CylindricalSurface.hxx>

class CylindricalSurfaceNode : public SurfaceNode
{
public:
  CylindricalSurfaceNode();
  void setOrigin(gp_Pnt origin);
  void setRadius(Standard_Real radius);

  std::string getName() override
  {
    return "CylindricalSurface";
  }

protected:
  Handle(Geom_Surface) getSurface(const ProgressHandler &handler) override;

private:
  Standard_Real m_radius;
  gp_Pnt m_origin;
  Standard_Boolean m_surfaceChanged;

  Handle(Geom_CylindricalSurface) m_surface;
};

#endif
