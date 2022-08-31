#ifndef SweepNode_HeaderFile
#define SweepNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <TopoDS_Wire.hxx>
#include <vector>

class SweepNode : public ReactCADNode
{
public:
  SweepNode();
  virtual ~SweepNode();
  void setProfile(const std::vector<Point> &points);

protected:
  TopoDS_Wire m_profile;
  std::vector<Point> m_points;

  void makeProfileFromPoints();
};

#endif
