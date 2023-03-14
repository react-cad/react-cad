#include <Geom_Plane.hxx>
#include <Precision.hxx>
#include <gp_Ax3.hxx>
#include <gp_Pln.hxx>

#include "SurfaceNode.hpp"

#include "BooleanOperation.hpp"

SurfaceNode::SurfaceNode() : m_children()
{
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

  setShape(TopoDS_Shape());

  Handle(Geom_Surface) surface = getSurface(handler);

  TopTools_ListOfShape svgShapes;

  for (auto it = std::begin(m_children); it != std::end(m_children) && scope.More(); ++it)
  {
    Handle(SVG) svg = (*it);
    svg->SetSurface(surface);
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
    setShape(op.Shape());
  }
}
