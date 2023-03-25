#include "SVGPathBuilder.hpp"

#include <Geom_Plane.hxx>
#include <Message.hxx>
#include <gp_Ax3.hxx>
#include <gp_GTrsf2d.hxx>
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

SVGPathBuilder::SVGPathBuilder(const std::string &pathData, const Handle(Geom_Plane) & plane)
    : m_shape(), m_pathData(pathData), m_plane(plane){};

void SVGPathBuilder::Build(const ProgressHandler &handler)
{
  if (m_done)
  {
    return;
  }

  SVGImage image = SVGImage::FromPathData(m_pathData);

  if (!image.IsDone())
  {
    return;
  }

  TopoDS_Shape shape;

  auto svgShape = image.begin();
  if (svgShape != image.end())
  {
    auto path = svgShape.begin();
    if (path != svgShape.end())
    {
      gp_GTrsf2d transform;
      shape = path.OpenWire(m_plane, transform);

      BRepLib::BuildCurves3d(shape);
    }
  }

  m_shape = shape;
  m_done = true;
}

TopoDS_Shape SVGPathBuilder::Shape(const ProgressHandler &handler)
{
  if (!m_done)
  {
    Build(handler);
  }
  return m_shape;
}
