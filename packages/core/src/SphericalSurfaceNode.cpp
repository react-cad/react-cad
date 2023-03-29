#include <Geom_SphericalSurface.hxx>
#include <Precision.hxx>
#include <gp_Ax3.hxx>
#include <gp_Pln.hxx>

#include "SphericalSurfaceNode.hpp"

#include "BooleanOperation.hpp"

SphericalSurfaceNode::SphericalSurfaceNode()
    : m_origin(gp::Origin()), m_radius(1.0), m_surfaceChanged(false), m_transform()
{
  m_surface = new Geom_SphericalSurface(gp_Ax3(m_origin, gp::DY(), gp::DZ()), m_radius);
  gp_Mat2d vectorial(gp_XY(1.0 / m_radius, 0), gp_XY(0, 1.0 / m_radius));
  m_transform.SetVectorialPart(vectorial);
}

void SphericalSurfaceNode::setOrigin(gp_Pnt origin)
{
  if (!m_origin.IsEqual(origin, Precision::Confusion()))
  {
    m_origin = origin;
    m_surfaceChanged = true;
    propsChanged();
  }
}

void SphericalSurfaceNode::setRadius(Standard_Real radius)
{
  if (!IsEqual(m_radius, radius))
  {
    m_radius = radius;
    gp_Mat2d vectorial(gp_XY(1.0 / m_radius, 0), gp_XY(0, 1.0 / m_radius));
    m_transform.SetVectorialPart(vectorial);
    m_surfaceChanged = true;
    propsChanged();
  }
}

Handle(Geom_Surface) SphericalSurfaceNode::getSurface()
{
  if (m_surfaceChanged)
  {
    m_surface = new Geom_SphericalSurface(gp_Ax3(m_origin, gp::DY(), gp::DZ()), m_radius);
    m_surfaceChanged = false;
  }
  return m_surface;
}

gp_GTrsf2d SphericalSurfaceNode::getTransform()
{
  return m_transform;
}
