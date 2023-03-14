#ifndef PlaneNode_HeaderFile
#define PlaneNode_HeaderFile

#include "SurfaceNode.hpp"

#include <Geom_Plane.hxx>
#include <gp_Dir.hxx>
#include <gp_Pnt.hxx>
#include <gp_Vec.hxx>

class PlaneNode : public SurfaceNode
{
public:
  PlaneNode();
  void setOrigin(gp_Pnt origin);

  std::string getName() override
  {
    return "PlaneSurface";
  }

protected:
  Handle(Geom_Surface) getSurface(const ProgressHandler &handler) override;

private:
  gp_Pnt m_origin;
  Standard_Boolean m_planeChanged;

  Handle(Geom_Plane) m_surface;
};

#endif
