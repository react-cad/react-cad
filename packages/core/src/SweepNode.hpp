#ifndef SweepNode_HeaderFile
#define SweepNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <TopoDS_Shape.hxx>
#include <TopoDS_Wire.hxx>
#include <utility>
#include <vector>

typedef std::pair<std::vector<TopoDS_Wire>, std::vector<TopoDS_Wire>> ShapeWires;

class SweepNode : public ReactCADNode
{
public:
  SweepNode();
  void setProfile(const std::vector<Point> &points);
  void setProfileSVG(const std::string &svg);

protected:
  TopoDS_Shape m_profile;
  Standard_Boolean m_profileChanged = false;

private:
  std::vector<Point> m_points;
  std::string m_svg;
  Standard_Boolean m_isSVG;
};

#endif
