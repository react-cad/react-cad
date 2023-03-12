#include <Geom_Plane.hxx>
#include <Precision.hxx>
#include <gp_Ax3.hxx>
#include <gp_Pln.hxx>

#include "SurfaceNode.hpp"

#include "BooleanOperation.hpp"

SurfaceNode::SurfaceNode() : m_children()
{
  gp_Ax3 position(gp::Origin(), gp::DZ(), gp::DX());
  position.YReverse();
  m_surface = new Geom_Plane(position);
}

void SurfaceNode::setOrigin(gp_Pnt origin)
{
  gp_Ax3 position = m_surface->Position();
  if (!position.Location().IsEqual(origin, Precision::Confusion()))
  {
    position.SetLocation(origin);
    m_surface = new Geom_Plane(position);
    propsChanged();
  }
}

void SurfaceNode::setNormal(gp_Vec normal)
{
  gp_Dir normalDirection(normal);
  gp_Ax3 position = m_surface->Position();
  if (!position.Direction().IsEqual(normalDirection, Precision::Angular()))
  {
    position.SetDirection(normalDirection);
    m_surface = new Geom_Plane(position);
    propsChanged();
  }
}

void SurfaceNode::setXDirection(gp_Vec xDirection)
{
  gp_Dir xDir(xDirection);
  gp_Ax3 position = m_surface->Position();
  if (!position.XDirection().IsEqual(xDir, Precision::Angular()))
  {
    position.SetXDirection(xDir);
    m_surface = new Geom_Plane(position);
    propsChanged();
  }
}

void SurfaceNode::setRightHanded(bool rightHanded)
{
  gp_Ax3 position = m_surface->Position();
  gp_Dir mainDirection = position.XDirection().Crossed(position.YDirection());
  if (mainDirection.IsEqual(position.Direction(), Precision::Angular()) != rightHanded)
  {
    position.YReverse();
    m_surface = new Geom_Plane(position);
    propsChanged();
  }
}

void SurfaceNode::appendSVG(Handle(SVG) & child)
{
  m_children.push_back(child);
  child->setParent(this);
  propsChanged();
}

void SurfaceNode::insertSVGBefore(Handle(SVG) & child, const Handle(SVG) & before)
{
  for (auto it = std::begin(m_children); it != std::end(m_children); ++it)
  {
    if (*it == before)
    {
      m_children.insert(it, child);
      child->setParent(this);
      propsChanged();
      break;
    }
  }
}

void SurfaceNode::removeSVG(Handle(SVG) & child)
{
  for (auto it = std::begin(m_children); it != std::end(m_children); ++it)
  {
    if (*it == child)
    {
      m_children.erase(it);
      child->setParent(nullptr);
      propsChanged();
      break;
    }
  }
}

void SurfaceNode::updateSVGs()
{
  propsChanged();
}

void SurfaceNode::computeShape(const ProgressHandler &handler)
{
  Message_ProgressScope scope(handler, "Constructing SVGs on surface", m_children.size() + 1);

  TopTools_ListOfShape svgShapes;

  for (auto it = std::begin(m_children); it != std::end(m_children) && scope.More(); ++it)
  {
    Handle(SVG) svg = (*it);
    svg->SetSurface(m_surface);
    svg->Build(handler.WithRange(scope.Next()));
    if (svg->IsDone())
    {
      svgShapes.Append(svg->Shape(handler));
    }
    else
    {
      handler.Abort("surface: svg construction failed");
    }
  }

  if (!scope.More())
  {
    return;
  }

  BooleanOperation op;
  op.Union(svgShapes, handler.WithRange(scope.Next()));
  if (op.HasErrors())
  {
    handler.Abort("surface: boolean operation failed\n\n" + op.Errors());
  }
  else
  {
    shape = op.Shape();
  }
}
