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
  virtual ~SweepNode();
  void setProfile(const std::vector<Point> &points);
  void setSVGProfile(const std::string &svg);

protected:
  enum Type
  {
    Unknown,
    Polygon,
    SVG,
  };

  Type m_type = Type::Unknown;

  std::vector<Point> m_points;
  bool m_pointsChanged = false;

  std::string m_svg;
  bool m_svgChanged = false;

  std::vector<ShapeWires> wires;

  TopoDS_Wire m_positiveProfile;
  TopoDS_Wire m_negativeProfile;
  bool m_profileChanged = false;

  void makeProfileFromSVG();
  void makeProfileFromPoints();
  void makeProfile();
};

#endif
