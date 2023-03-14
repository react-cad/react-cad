#include <Geom_Plane.hxx>
#include <Precision.hxx>
#include <gp_Ax3.hxx>
#include <gp_Pln.hxx>

#include "PlaneNode.hpp"

#include "BooleanOperation.hpp"

PlaneNode::PlaneNode() : m_origin(gp::Origin())
{
  m_surface = new Geom_Plane(gp_Ax3(m_origin, gp::DZ(), gp::DX()));
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

Handle(Geom_Surface) PlaneNode::getSurface(const ProgressHandler &handler)
{
  if (m_planeChanged)
  {
    m_surface = new Geom_Plane(gp_Ax3(m_origin, gp::DZ(), gp::DX()));
    m_planeChanged = false;
  }
  return m_surface;
}
