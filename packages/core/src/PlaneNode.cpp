#include <Geom_Plane.hxx>
#include <Precision.hxx>
#include <gp_Ax3.hxx>
#include <gp_Pln.hxx>

#include "PlaneNode.hpp"

#include "BooleanOperation.hpp"

PlaneNode::PlaneNode() : m_origin(gp::Origin()), m_normal(gp::DZ()), m_xDirection(gp::DX()), m_planeChanged(false)
{
  m_surface = new Geom_Plane(gp_Ax3(m_origin, m_normal, m_xDirection));
}

void PlaneNode::setOrigin(gp_Pnt origin)
{
  if (!m_origin.IsEqual(origin, Precision::Confusion()))
  {
    m_origin = origin;
    m_planeChanged = true;
    propsChanged();
  }
}

void PlaneNode::setNormal(gp_Vec normal)
{
  gp_Dir normalDirection(normal);
  if (!m_normal.IsEqual(normalDirection, Precision::Angular()))
  {
    m_normal = normalDirection;
    m_planeChanged = true;
    propsChanged();
  }
}

void PlaneNode::setXDirection(gp_Vec xDirection)
{
  gp_Dir xDir(xDirection);
  if (!m_xDirection.IsEqual(xDir, Precision::Angular()))
  {
    m_xDirection = xDir;
    m_planeChanged = true;
    propsChanged();
  }
}

Handle(Geom_Surface) PlaneNode::getSurface(const ProgressHandler &handler)
{
  if (m_planeChanged)
  {
    if (!m_xDirection.IsNormal(m_normal, Precision::Angular()))
    {
      handler.Abort("surface: x direction does not lie on the surface");
      return m_surface;
    }
    m_surface = new Geom_Plane(gp_Ax3(m_origin, m_normal, m_xDirection));
    m_planeChanged = false;
  }
  return m_surface;
}
