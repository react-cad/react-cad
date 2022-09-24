#define NANOSVG_IMPLEMENTATION
#include "SVGImage.hpp"

#include <Precision.hxx>

#include <cstring>
#include <memory>

SVGImage SVGImage::FromPathData(const std::string &pathData)
{
  std::stringstream svg;
  svg << "<svg xmlns=\"http://www.w3.org/2000/svg\"><path d=\"" << pathData << "\" /></svg>";
  return SVGImage(svg.str());
}

SVGImage::SVGImage(const std::string &svg)
{
  char *str = strdup(svg.c_str());
  m_image = nsvgParse(str, "px", 96);
  free(str);
}

SVGImage::~SVGImage()
{
  nsvgDelete(m_image);
}

NSVGimage *copyImage(NSVGimage *other)
{
  if (other == NULL)
  {
    return NULL;
  }

  NSVGimage *image = (NSVGimage *)malloc(sizeof(NSVGimage));
  if (image == NULL)
  {
    return NULL;
  }

  std::memcpy(image, other, sizeof(NSVGimage));

  if (other->shapes == NULL)
  {
    return image;
  }

  NSVGshape *shape = other->shapes;
  NSVGshape *sdest = (NSVGshape *)malloc(sizeof(NSVGshape));

  std::memcpy(sdest, shape, sizeof(NSVGshape));

  image->shapes = sdest;

  while (shape->next != NULL)
  {
    shape = shape->next;

    sdest->next = (NSVGshape *)malloc(sizeof(NSVGshape));
    sdest = sdest->next;

    std::memcpy(sdest, shape, sizeof(NSVGshape));

    if (shape->fill.type == NSVG_PAINT_LINEAR_GRADIENT || shape->fill.type == NSVG_PAINT_RADIAL_GRADIENT)
    {
      size_t size = sizeof(NSVGgradient) + sizeof(NSVGgradientStop) * (shape->fill.gradient->nstops - 1);
      sdest->fill.gradient = (NSVGgradient *)malloc(size);
      std::memcpy(sdest->fill.gradient, shape->fill.gradient, size);
    }

    if (shape->stroke.type == NSVG_PAINT_LINEAR_GRADIENT || shape->stroke.type == NSVG_PAINT_RADIAL_GRADIENT)
    {
      size_t size = sizeof(NSVGgradient) + sizeof(NSVGgradientStop) * (shape->stroke.gradient->nstops - 1);
      sdest->stroke.gradient = (NSVGgradient *)malloc(size);
      std::memcpy(sdest->stroke.gradient, shape->stroke.gradient, size);
    }

    if (shape->paths == NULL)
    {
      continue;
    }

    NSVGpath *path = shape->paths;
    NSVGpath *pdest = (NSVGpath *)malloc(sizeof(NSVGpath));

    std::memcpy(pdest, path, sizeof(NSVGpath));

    sdest->paths = pdest;

    while (path->next != NULL)
    {
      path = path->next;

      pdest->next = (NSVGpath *)malloc(sizeof(NSVGpath));
      pdest = pdest->next;

      std::memcpy(pdest, path, sizeof(NSVGpath));

      size_t size = path->npts * 2 * sizeof(float);

      pdest->pts = (float *)malloc(size);
      std::memcpy(pdest->pts, path->pts, size);
    }
  }

  return image;
}

SVGImage::SVGImage(const SVGImage &other) : m_image(copyImage(other.m_image))
{
}

SVGImage &SVGImage::operator=(const SVGImage &other)
{
  if (this == &other)
  {
    return *this;
  }
  nsvgDelete(m_image);
  m_image = copyImage(other.m_image);
  return *this;
}

float SVGImage::Height()
{
  return m_image->height;
}

float SVGImage::Width()
{
  return m_image->width;
}

SVGImage::SVGBezierCurve::operator Handle(Geom2d_Curve)()
{
  Handle(Geom2d_Curve) curve;

  if (IsZeroLength())
  {
    return curve;
  }
  else if (IsStraightLine())
  {
    // Straight line
    GCE2d_MakeSegment line(p0(), p3());
    curve = line.Value();
  }
  else
  {
    // Bezier curve
    NCollection_Array1<gp_Pnt2d> poles(0, 3);
    poles[0] = p0();
    poles[1] = p1();
    poles[2] = p2();
    poles[3] = p3();

    curve = new Geom2d_BezierCurve(poles);
  }

  return curve;
};

float SVGImage::SVGBezierCurve::orientation()
{
  return (m_ptr[6] - m_ptr[0]) * (-m_ptr[7] + -m_ptr[1]);
}

gp_Pnt2d SVGImage::SVGBezierCurve::p0()
{
  return gp_Pnt2d(m_ptr[0], -m_ptr[1]);
}

gp_Pnt2d SVGImage::SVGBezierCurve::p1()
{
  return gp_Pnt2d(m_ptr[2], -m_ptr[3]);
}

gp_Pnt2d SVGImage::SVGBezierCurve::p2()
{
  return gp_Pnt2d(m_ptr[4], -m_ptr[5]);
}

gp_Pnt2d SVGImage::SVGBezierCurve::p3()
{
  return gp_Pnt2d(m_ptr[6], -m_ptr[7]);
}

Standard_Boolean SVGImage::SVGBezierCurve::IsZeroLength()
{
  return p0().IsEqual(p1(), Precision::Confusion()) && p1().IsEqual(p2(), Precision::Confusion()) &&
         p2().IsEqual(p3(), Precision::Confusion());
}

constexpr Standard_Boolean SVGImage::SVGBezierCurve::floatEqual(float x, float y)
{
  return (fabs(x - y) <= std::numeric_limits<float>::epsilon());
}

Standard_Boolean SVGImage::SVGBezierCurve::IsStraightLine()
{
  float px = m_ptr[0];
  float py = m_ptr[1];
  float x = m_ptr[6];
  float y = m_ptr[7];

  float dx = x - px;
  float dy = y - py;

  return (floatEqual(m_ptr[2], px + dx / 3.0f) && floatEqual(m_ptr[3], py + dy / 3.0f) &&
          floatEqual(m_ptr[4], x - dx / 3.0f) && floatEqual(m_ptr[5], y - dy / 3.0f));
}
