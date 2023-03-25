#define NANOSVG_IMPLEMENTATION
#include "SVGImage.hpp"

#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <GeomLib.hxx>
#include <Message.hxx>
#include <Precision.hxx>

#include <cstring>
#include <memory>
#include <vector>

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

bool SVGImage::IsDone()
{
  return m_image != NULL && m_image->shapes != NULL;
}

float SVGImage::Height()
{
  return m_image->height;
}

float SVGImage::Width()
{
  return m_image->width;
}

void SVGImage::SVGBezierCurve::getCurve(Curve &curve)
{

  curve.p0.x = m_ptr[0];
  curve.p0.y = m_ptr[1];
  curve.p1.x = m_ptr[2];
  curve.p1.y = m_ptr[3];
  curve.p2.x = m_ptr[4];
  curve.p2.y = m_ptr[5];
  curve.p3.x = m_ptr[6];
  curve.p3.y = m_ptr[7];
};

void SVGImage::SVGBezierCurveReverse::getCurve(Curve &curve)
{
  curve.p3.x = m_ptr[0];
  curve.p3.y = m_ptr[1];
  curve.p2.x = m_ptr[2];
  curve.p2.y = m_ptr[3];
  curve.p1.x = m_ptr[4];
  curve.p1.y = m_ptr[5];
  curve.p0.x = m_ptr[6];
  curve.p0.y = m_ptr[7];
};

float SVGImage::SVGBezierCurve::orientation()
{
  return (m_ptr[6] - m_ptr[0]) * (m_ptr[7] + m_ptr[1]);
}

gp_Pnt2d SVGImage::SVGBezierCurve::p0()
{
  return gp_Pnt2d(m_ptr[0], m_ptr[1]);
}

gp_Pnt2d SVGImage::SVGBezierCurve::p1()
{
  return gp_Pnt2d(m_ptr[2], m_ptr[3]);
}

gp_Pnt2d SVGImage::SVGBezierCurve::p2()
{
  return gp_Pnt2d(m_ptr[4], m_ptr[5]);
}

gp_Pnt2d SVGImage::SVGBezierCurve::p3()
{
  return gp_Pnt2d(m_ptr[6], m_ptr[7]);
}

float SVGImage::SVGPath::orientation()
{
  if (m_orientation != 0)
  {
    return m_orientation;
  }

  float *first = m_ptr->pts;
  float *last = m_ptr->pts + ((m_ptr->npts - 1) * (std::ptrdiff_t)2);

  for (auto bezier = begin(); bezier != end(); ++bezier)
  {
    m_orientation += bezier.orientation();
  }
  m_orientation += ((first[0] - last[0]) * (first[1] - last[1]));

  return m_orientation;
}

inline void dumpCurve(const SVGImage::Curve &curve)
{
  std::stringstream ss;
  ss << curve.p0.x << "," << curve.p0.y << " " << curve.p1.x << "," << curve.p1.y << " " << curve.p2.x << ","
     << curve.p2.y << " " << curve.p3.x << "," << curve.p3.y;
  Message::DefaultMessenger()->Send(ss);
}

inline bool isSmall(const SVGImage::Curve &curve)
{
  double lengthSquared = pow(curve.p3.x - curve.p0.x, 2) + pow(curve.p3.y - curve.p0.y, 2);
  return lengthSquared < 1e-11;
}

inline bool isStraight(const SVGImage::Curve &curve)
{
  float px = curve.p0.x;
  float py = curve.p0.y;
  float x = curve.p3.x;
  float y = curve.p3.y;

  float dx = x - px;
  float dy = y - py;

  return (IsEqual(curve.p1.x, px + dx / 3.0f) && IsEqual(curve.p1.y, py + dy / 3.0f) &&
          IsEqual(curve.p2.x, x - dx / 3.0f) && IsEqual(curve.p2.y, y - dy / 3.0f));
}

inline gp_Pnt2d makePoint(const SVGImage::CurvePoint &point)
{
  return gp_Pnt2d(point.x, point.y);
}

TopoDS_Wire SVGImage::SVGPath::OpenWire(const Handle(Geom_Surface) & surface, const gp_GTrsf2d &transform)
{
  int32_t nCurves = m_ptr->npts / 3;
  std::vector<Curve> curves(nCurves);

  int32_t curveIdx = 0;
  for (auto bezier = begin(); bezier != end(); ++bezier, ++curveIdx)
  {
    bezier.getCurve(curves[curveIdx]);
    if (curveIdx > 0)
    {
      curves[curveIdx - 1].next = &curves[curveIdx];
      curves[curveIdx].prev = &curves[curveIdx - 1];
    }
  }

  // Cap ends
  curves[nCurves - 1].next = nullptr;
  curves[0].prev = nullptr;

  // Remove small edges
  Curve *firstCurve = &curves[0];
  Curve *curve = &curves[nCurves - 1];
  bool firstCurveTooSmall = false;
  while (curve != nullptr)
  {
    // Keep adding curves until it is a reasonable length
    while (isSmall(*curve))
    {
      // Set current curve end to next curve end
      curve->p0 = curve->prev->p0;
      if (curve->prev == firstCurve)
      {
        curve->prev = nullptr;
        firstCurve = curve;
        firstCurveTooSmall = true;
        break;
      }
      else
      {
        curve->prev = curve->prev->prev;
        curve->prev->next = curve;
      }
    }
    curve = curve->prev;
  }

  if (firstCurveTooSmall)
  {
    curve = firstCurve;
    while (curve != nullptr)
    {
      // Keep adding curves until it is a reasonable length
      while (isSmall(*curve))
      {
        // Whole path is too short
        if (curve->next == nullptr)
        {
          return TopoDS_Wire();
        }

        // Set current curve end to next curve end
        curve->p1 = curve->next->p1;
        curve->p2 = curve->next->p2;
        curve->p3 = curve->next->p3;
        // Skip next curve
        curve->next = curve->next->next;
        curve->next->prev = curve;
      }
      curve = curve->next;
    }
  }

  // Make wire
  BRepBuilderAPI_MakeWire wire;

  curve = firstCurve;
  do
  {
    Handle(Geom2d_Curve) geom2dCurve;

    if (isStraight(*curve))
    {
      // Straight line
      GCE2d_MakeSegment line(makePoint(curve->p0), makePoint(curve->p3));
      geom2dCurve = line.Value();
    }
    else
    {
      // Bezier curve
      TColgp_Array1OfPnt2d poles(0, 3);
      poles[0] = makePoint(curve->p0);
      poles[1] = makePoint(curve->p1);
      poles[2] = makePoint(curve->p2);
      poles[3] = makePoint(curve->p3);

      geom2dCurve = new Geom2d_BezierCurve(poles);
    }

    geom2dCurve = GeomLib::GTransform(geom2dCurve, transform);
    BRepLib_MakeEdge edge(geom2dCurve, surface);
    wire.Add(edge);

    curve = curve->next;
  } while (curve != nullptr);

  return wire;
}

TopoDS_Wire SVGImage::SVGPath::ClosedWire(const Handle(Geom_Surface) & surface, const gp_GTrsf2d &transform)
{
  int32_t nCurves = m_ptr->npts / 3;
  if (nCurves < 2)
  {
    return TopoDS_Wire();
  }

  std::vector<Curve> curves(nCurves);

  int32_t curveIdx = 0;
  if (orientation() >= 0)
  {
    for (auto bezier = begin(); bezier != end(); ++bezier, ++curveIdx)
    {
      bezier.getCurve(curves[curveIdx]);
      if (curveIdx > 0)
      {
        curves[curveIdx - 1].next = &curves[curveIdx];
        curves[curveIdx].prev = &curves[curveIdx - 1];
      }
    }
  }
  else
  {
    for (auto bezier = rbegin(); bezier != rend(); ++bezier, ++curveIdx)
    {
      bezier.getCurve(curves[curveIdx]);
      if (curveIdx > 0)
      {
        curves[curveIdx - 1].next = &curves[curveIdx];
        curves[curveIdx].prev = &curves[curveIdx - 1];
      }
    }
  }

  // Join end to start
  curves[nCurves - 1].next = &curves[0];
  curves[nCurves - 1].p3 = curves[0].p0;
  curves[0].prev = &curves[nCurves - 1];

  // Remove small edges
  Curve *firstCurve = &curves[0];
  Curve *curve = &curves[0];
  do
  {
    // Keep adding curves until it is a reasonable length
    while (isSmall(*curve))
    {
      // Set current curve end to next curve end
      curve->p1 = curve->next->p1;
      curve->p2 = curve->next->p2;
      curve->p3 = curve->next->p3;
      // Skip next curve
      if (curve->next == firstCurve)
      {
        // Skipping first curve, change pointer
        firstCurve = curve->next->next;
      }
      curve->next = curve->next->next;
      curve->next->prev = curve;

      // Whole path is too short
      if (curve->next == curve)
      {
        return TopoDS_Wire();
      }
    }
    curve = curve->next;
  } while (curve != firstCurve);

  // Make wire
  BRepBuilderAPI_MakeWire wire;

  curve = firstCurve;
  do
  {
    Handle(Geom2d_Curve) geom2dCurve;

    if (isStraight(*curve))
    {
      // Straight line
      GCE2d_MakeSegment line(makePoint(curve->p0), makePoint(curve->p3));
      geom2dCurve = line.Value();
    }
    else
    {
      // Bezier curve
      TColgp_Array1OfPnt2d poles(0, 3);
      poles[0] = makePoint(curve->p0);
      poles[1] = makePoint(curve->p1);
      poles[2] = makePoint(curve->p2);
      poles[3] = makePoint(curve->p3);

      geom2dCurve = new Geom2d_BezierCurve(poles);
    }

    geom2dCurve = GeomLib::GTransform(geom2dCurve, transform);
    BRepLib_MakeEdge edge(geom2dCurve, surface);
    wire.Add(edge);

    curve = curve->next;
  } while (curve != firstCurve);

  return wire;
}
