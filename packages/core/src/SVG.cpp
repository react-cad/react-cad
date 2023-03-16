#include "SVG.hpp"
#include "SVGSubPath.hpp"

#include <Geom_Plane.hxx>
#include <gp_Ax3.hxx>
#include <gp_Pln.hxx>

#include <NCollection_List.hxx>

#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRep_Builder.hxx>

#include <Message_ProgressScope.hxx>
#include <ShapeFix_Shape.hxx>
#include <ShapeFix_Wire.hxx>

#include <TopoDS_Wire.hxx>

#include "BooleanOperation.hpp"
#include "SVGImage.hpp"
#include "SurfaceNode.hpp"

#include <Geom_Plane.hxx>
#include <gp_Ax3.hxx>
#include <gp_Pln.hxx>

SVG::SVG() : m_shape(), m_parent(), m_svg(), m_surface(new Geom_Plane(gp_Ax3(gp::Origin(), gp::DZ(), gp::DX()))){};

void SVG::setParent(const opencascade::handle<SurfaceNode> &parent)
{
  m_parent = parent;
}

void SVG::setSource(const std::string &svg)
{
  if (svg.compare(m_svg) != 0)
  {
    m_svg = svg;
    m_done = false;
    m_shape = TopoDS_Shape();
    if (!m_parent.IsNull())
    {
      m_parent->updateSVGs();
    }
  }
}

void SVG::SetSurface(const Handle(Geom_Surface) & surface)
{
  if (surface != m_surface)
  {
    m_surface = surface;
    m_done = false;
    m_shape = TopoDS_Shape();
  }
}

void SVG::Build(const ProgressHandler &handler)
{
  if (m_done)
  {
    return;
  }

  SVGImage image(m_svg);

  if (!image.IsDone())
  {
    return;
  }

  ShapeFix_Wire fixWire;
  fixWire.SetSurface(m_surface);

  int nbShape = 0;
  for (auto shape = image.begin(); shape != image.end(); ++shape)
  {
    ++nbShape;
  }

  Message_ProgressScope scope(handler, "Parsing SVG", nbShape + 1);
  TopTools_ListOfShape svgShapes;

  for (auto shape = image.begin(); shape != image.end() && scope.More(); ++shape)
  {
    NCollection_List<Handle(SVGSubPath)> subpaths;
    Standard_Real avgSize = 0;

    int nbPaths = 0;
    for (auto path = shape.begin(); path != shape.end(); ++path)
    {
      ++nbPaths;
    }

    Message_ProgressScope pathScope(scope.Next(), "Parsing SVG path", nbPaths * 2);

    for (auto path = shape.begin(); path != shape.end() && pathScope.More(); ++path)
    {
      float orientation = 0;
      BRepBuilderAPI_MakeWire makeWire;

      for (auto curve = path.begin(); curve != path.end(); ++curve)
      {
        Handle(Geom2d_Curve) c = curve;
        if (!c.IsNull())
        {
          BRepBuilderAPI_MakeEdge edge(c, m_surface);
          makeWire.Add(edge);

          orientation += curve.orientation();
        }
      }

      SVGSubPath::Direction direction = orientation >= 0 ? SVGSubPath::Direction::CW : SVGSubPath::Direction::CCW;
      TopoDS_Wire suspiciousWire = makeWire;
      if (direction == SVGSubPath::Direction::CCW)
      {
        suspiciousWire.Reverse();
      }

      fixWire.Load(suspiciousWire);
      fixWire.Perform();

      TopoDS_Wire wire = fixWire.Wire();

      BRepBuilderAPI_MakeFace face(m_surface, wire);

      Handle(SVGSubPath) subpath = new SVGSubPath(wire, face, direction);
      Bnd_Box box = subpath->GetBndBox();
      avgSize += box.CornerMin().Distance(box.CornerMax());

      subpaths.Append(subpath);
    }

    if (!pathScope.More())
    {
      continue;
    }

    avgSize /= subpaths.Size();

    // Build path hierarchy by colliding paths
    NCollection_CellFilter<SVGSubPath::Inspector> cells(avgSize);
    for (auto subpath : subpaths)
    {
      gp_XYZ min = subpath->GetBndBox().CornerMin().XYZ();
      gp_XYZ max = subpath->GetBndBox().CornerMax().XYZ();

      SVGSubPath::Inspector inspector(subpath);
      cells.Inspect(min, max, inspector);
      cells.Add(subpath, min, max);
    }

    // Build shape from root paths
    for (auto subpath : subpaths)
    {
      if (!subpath->HasParent())
      {
        svgShapes.Append(subpath->BuildFaces((NSVGfillRule)shape->fillRule, handler));
      }
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
    handler.Abort("svg parse: boolean operation failed\n\n" + op.Errors());
  }
  else
  {
    m_shape = op.Shape();
    m_done = true;
  }
}

TopoDS_Shape SVG::Shape(const ProgressHandler &handler)
{
  Build(handler);
  return m_shape;
}
