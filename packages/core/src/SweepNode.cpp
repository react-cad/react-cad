#include "SweepNode.h"

#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepBuilderAPI_MakePolygon.hxx>

SweepNode::SweepNode()
{
  m_points = std::vector<Point>(
      {{.x = -1, .y = -1, .z = 0}, {.x = -1, .y = 1, .z = 0}, {.x = 1, .y = 1, .z = 0}, {.x = 1, .y = -1, .z = 0}});
  makeProfileFromPoints();
}

SweepNode::~SweepNode()
{
}

void SweepNode::setProfile(const std::vector<Point> &points)
{
  Standard_Boolean changed = false;

  if (m_points.size() > points.size())
  {
    m_points = std::vector<Point>(points);
    changed = true;
  }
  else
  {
    if (points.size() > m_points.size())
    {
      m_points.resize(points.size());
      changed = true;
    }

    for (size_t i = 0; i < points.size(); ++i)
    {
      if (!doubleEquals(m_points[i].x, points[i].x) || !doubleEquals(m_points[i].y, points[i].y) ||
          !doubleEquals(m_points[i].z, points[i].z))
      {
        m_points[i] = points[i];
        changed = true;
      }
    }
  }

  if (changed)
  {
    makeProfileFromPoints();
    propsChanged();
  }
}

void SweepNode::makeProfileFromPoints()
{
  BRepBuilderAPI_MakePolygon polygon;
  for (auto point : m_points)
  {
    polygon.Add(gp_Pnt(point.x, point.y, point.z));
  }
  polygon.Close();

  BRepBuilderAPI_MakeFace face(polygon, Standard_True);
  if (face.IsDone())
  {
    m_profile = polygon.Wire();
  }
}
