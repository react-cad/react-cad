#include <Geom_CylindricalSurface.hxx>
#include <Precision.hxx>
#include <gp_Ax3.hxx>
#include <gp_Pln.hxx>

#include "CylindricalSurfaceNode.hpp"

#include "BooleanOperation.hpp"

CylindricalSurfaceNode::CylindricalSurfaceNode() : m_origin(gp::Origin()), m_radius(1.0), m_surfaceChanged(false)
{
  m_surface = new Geom_CylindricalSurface(gp_Ax3(m_origin, gp::DZ(), gp::DX()), m_radius);
}

void CylindricalSurfaceNode::setOrigin(gp_Pnt origin)
{
  if (!m_origin.IsEqual(origin, Precision::Confusion()))
  {
    m_origin = origin;
    m_surfaceChanged = true;
    propsChanged();
  }
}

void CylindricalSurfaceNode::setRadius(Standard_Real radius)
{
  if (!IsEqual(m_radius, radius))
  {
    m_radius = radius;
    m_surfaceChanged = true;
    propsChanged();
  }
}

Handle(Geom_Surface) CylindricalSurfaceNode::getSurface(const ProgressHandler &handler)
{
  if (m_surfaceChanged)
  {
    m_surface = new Geom_CylindricalSurface(gp_Ax3(m_origin, gp::DZ(), gp::DX()), m_radius);
    m_surfaceChanged = false;
  }
  return m_surface;
}
