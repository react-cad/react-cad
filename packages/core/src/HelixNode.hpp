#ifndef HelixNode_HeaderFile
#define HelixNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <TopoDS_Wire.hxx>

struct HelixProps
{
  double pitch;
  double height;
};

class HelixNode : public ReactCADNode
{
public:
  HelixNode();
  virtual ~HelixNode();
  void setProps(const HelixProps &props);
  void setProfile(const std::vector<Point> &points);
  void setProfileSVG(const std::string &svg);

protected:
  void computeShape() override;

private:
  HelixProps m_props;
  bool m_pitchOrHeightChanged = false;

  TopoDS_Shape m_profile;
  TopoDS_Wire m_spine;
  TopoDS_Wire m_guide;

  TopoDS_Shape makeHelix(const TopoDS_Wire &profile);
};

#endif
