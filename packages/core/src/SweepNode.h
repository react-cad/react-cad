#ifndef SweepNode_HeaderFile
#define SweepNode_HeaderFile

#include "Geometry.h"
#include "ReactCADNode.h"

#include <TopoDS_Shape.hxx>
#include <TopoDS_Wire.hxx>
#include <vector>

class SweepNode : public ReactCADNode
{
public:
  SweepNode();
  virtual ~SweepNode();
  void setProfile(const std::vector<Point> &points);
  void setSVGProfile(const std::string &svg);

protected:
  TopoDS_Shape m_face;
  TopoDS_Wire m_profile;
  std::vector<Point> m_points;

  void makeProfileFromPoints();
};

#endif
