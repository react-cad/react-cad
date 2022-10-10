#include "SVGPathBuilder.hpp"

#include <Geom_Plane.hxx>
#include <Message.hxx>
#include <gp_Ax3.hxx>
#include <gp_Pln.hxx>

#include <NCollection_List.hxx>

#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepLib.hxx>
#include <BRep_Builder.hxx>

#include <ShapeFix_Shape.hxx>
#include <ShapeFix_Wire.hxx>

#include <TopoDS_Wire.hxx>

#include "SVGImage.hpp"
#include "operations.hpp"

SVGPathBuilder::SVGPathBuilder(const std::string &pathData, const Handle(Geom_Plane) & plane)
    : m_shape(), m_pathData(pathData), m_plane(plane){};

TopoDS_Shape SVGPathBuilder::Shape(const Message_ProgressRange &theRange)
{
  if (!m_shape.IsNull())
  {
    return m_shape;
  }

  SVGImage image = SVGImage::FromPathData(m_pathData);

  TopoDS_Shape shape;

  auto svgShape = image.begin();
  if (svgShape != image.end())
  {
    auto path = svgShape.begin();
    if (path != svgShape.end())
    {
      BRepBuilderAPI_MakeWire makeWire;

      for (auto curve = path.begin(); curve != path.end(); ++curve)
      {
        Handle(Geom2d_Curve) c = curve;
        if (!c.IsNull())
        {
          c->Translate(gp_Vec2d(0, image.Height()));
          BRepBuilderAPI_MakeEdge edge(c, m_plane);
          makeWire.Add(edge);
        }
      }

      TopoDS_Wire suspiciousWire = makeWire;

      BRepLib::BuildCurves3d(suspiciousWire);

      ShapeFix_Wire fixWire;
      fixWire.SetSurface(m_plane);
      fixWire.Load(suspiciousWire);
      fixWire.Perform();

      TopoDS_Wire wire = fixWire.Wire();
      wire.Orientation(TopAbs_REVERSED);

      shape = wire;
      Message::DefaultMessenger()->Send("Path built");
    }
  }

  return shape;
}
