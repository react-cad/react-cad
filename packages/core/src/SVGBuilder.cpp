#include "SVGBuilder.hpp"
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

#include "SVGImage.hpp"
#include "operations.hpp"

SVGBuilder::SVGBuilder(const std::string &svg) : m_shape(), m_svg(svg){};

TopoDS_Shape SVGBuilder::Shape(const Message_ProgressRange &theRange)
{
  if (!m_shape.IsNull())
  {
    return m_shape;
  }

  SVGImage image(m_svg);

  Handle(Geom_Plane) surface = new Geom_Plane(gp_Ax3(gp::Origin(), gp::DZ(), gp::DX()));

  ShapeFix_Wire fixWire;
  fixWire.SetSurface(surface);

  TopTools_ListOfShape svgShapes;

  for (auto shape = image.begin(); shape != image.end(); ++shape)
  {
    NCollection_List<Handle(SVGSubPath)> subpaths;
    Standard_Real avgSize = 0;

    for (auto path = shape.begin(); path != shape.end(); ++path)
    {
      float orientation = 0;
      BRepBuilderAPI_MakeWire makeWire;

      for (auto curve = path.begin(); curve != path.end(); ++curve)
      {
        Handle(Geom2d_Curve) c = curve;
        if (!c.IsNull())
        {
          BRepBuilderAPI_MakeEdge edge(c, surface);
          makeWire.Add(edge);

          orientation += curve.orientation();
        }
      }

      TopoDS_Wire suspiciousWire = makeWire;
      suspiciousWire.Reverse();

      fixWire.Load(suspiciousWire);
      fixWire.Perform();

      TopoDS_Wire wire = fixWire.Wire();

      BRepBuilderAPI_MakeFace face(surface, wire);

      SVGSubPath::Direction direction = orientation >= 0 ? SVGSubPath::Direction::CW : SVGSubPath::Direction::CCW;
      Handle(SVGSubPath) subpath = new SVGSubPath(wire, face, direction);
      Bnd_Box box = subpath->GetBndBox();
      avgSize += box.CornerMin().Distance(box.CornerMax());

      subpaths.Append(subpath);
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
        svgShapes.Append(subpath->BuildFaces((NSVGfillRule)shape->fillRule));
      }
    }
  }

  return unionOp(svgShapes);
}
