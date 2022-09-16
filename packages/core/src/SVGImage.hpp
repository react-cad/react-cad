#ifndef SVGImage_HeaderFile
#define SVGImage_HeaderFile

#include <GCE2d_MakeSegment.hxx>
#include <Geom2d_BezierCurve.hxx>
#include <Geom2d_BoundedCurve.hxx>
#include <NCollection_Array1.hxx>
#include <gp_Pnt2d.hxx>

#include <limits>
#include <memory>
#include <sstream>
#include <string>

#include <cstddef>
#include <iterator>

#include <math.h>
#include <stdio.h>
#include <string.h>

#include <nanosvg.h>

class SVGImage
{
public:
  SVGImage(const std::string &svg);
  static SVGImage FromPathData(const std::string &pathData);

  ~SVGImage();
  SVGImage(const SVGImage &other);
  SVGImage &operator=(const SVGImage &other);

  float Height();
  float Width();

  struct SVGBezierCurve
  {
    using iterator_category = std::forward_iterator_tag;
    using difference_type = std::ptrdiff_t;
    using value_type = float;
    using pointer = value_type *;
    using reference = value_type &;

    SVGBezierCurve(pointer ptr) : m_ptr(ptr){};

    reference operator*() const
    {
      return *m_ptr;
    }
    pointer operator->()
    {
      return m_ptr;
    }

    SVGBezierCurve &operator++()
    {
      m_ptr += 6;
      return *this;
    }

    SVGBezierCurve operator++(int)
    {
      SVGBezierCurve tmp = *this;
      ++(*this);
      return tmp;
    }

    friend bool operator==(const SVGBezierCurve &a, const SVGBezierCurve &b)
    {
      return a.m_ptr == b.m_ptr;
    };
    friend bool operator!=(const SVGBezierCurve &a, const SVGBezierCurve &b)
    {
      return a.m_ptr != b.m_ptr;
    };

    operator Handle(Geom2d_Curve)();
    float orientation();
    gp_Pnt2d p0();
    gp_Pnt2d p1();
    gp_Pnt2d p2();
    gp_Pnt2d p3();

  private:
    constexpr Standard_Boolean floatEqual(float x, float y);
    Standard_Boolean IsStraightLine();
    Standard_Boolean IsZeroLength();

    pointer m_ptr;
  };

  struct SVGPath
  {
    using iterator_category = std::forward_iterator_tag;
    using difference_type = std::ptrdiff_t;
    using value_type = NSVGpath;
    using pointer = value_type *;
    using reference = value_type &;

    SVGPath(pointer ptr) : m_ptr(ptr){};

    reference operator*() const
    {
      return *m_ptr;
    }
    pointer operator->()
    {
      return m_ptr;
    }

    SVGPath &operator++()
    {
      m_ptr = m_ptr->next;
      return *this;
    }

    SVGPath operator++(int)
    {
      SVGPath tmp = *this;
      ++(*this);
      return tmp;
    }

    friend bool operator==(const SVGPath &a, const SVGPath &b)
    {
      return a.m_ptr == b.m_ptr;
    };
    friend bool operator!=(const SVGPath &a, const SVGPath &b)
    {
      return a.m_ptr != b.m_ptr;
    };

    SVGBezierCurve begin()
    {
      return SVGBezierCurve(m_ptr->pts);
    }
    SVGBezierCurve end()
    {
      return SVGBezierCurve(m_ptr->pts + ((m_ptr->npts - 1) * (std::ptrdiff_t)2));
    }

  private:
    pointer m_ptr;
  };

  struct SVGShape
  {
    using iterator_category = std::forward_iterator_tag;
    using difference_type = std::ptrdiff_t;
    using value_type = NSVGshape;
    using pointer = value_type *;
    using reference = value_type &;

    SVGShape(pointer ptr) : m_ptr(ptr){};

    reference operator*() const
    {
      return *m_ptr;
    }
    pointer operator->()
    {
      return m_ptr;
    }

    SVGShape &operator++()
    {
      m_ptr = m_ptr->next;
      return *this;
    }

    SVGShape operator++(int)
    {
      SVGShape tmp = *this;
      ++(*this);
      return tmp;
    }

    friend bool operator==(const SVGShape &a, const SVGShape &b)
    {
      return a.m_ptr == b.m_ptr;
    };
    friend bool operator!=(const SVGShape &a, const SVGShape &b)
    {
      return a.m_ptr != b.m_ptr;
    };

    SVGPath begin()
    {
      return SVGPath(m_ptr->paths);
    };
    SVGPath end()
    {
      return SVGPath(nullptr);
    };

  private:
    pointer m_ptr;
    float m_height;
  };

  SVGShape begin()
  {
    return SVGShape(m_image->shapes);
  }
  SVGShape end()
  {
    return SVGShape(nullptr);
  };

private:
  struct NSVGimage *m_image;
};

#endif
