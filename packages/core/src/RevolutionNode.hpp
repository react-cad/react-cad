#ifndef RevolutionNode_HeaderFile
#define RevolutionNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <string>

#include <TopoDS_Shape.hxx>

struct RevolutionProps
{
  std::string axis;
  double angle;
};

class RevolutionNode : public ReactCADNode
{
public:
  RevolutionNode();
  virtual ~RevolutionNode();
  void setProps(const RevolutionProps &props);
  void setProfile(const std::vector<Point> &points);
  void setProfileSVG(const std::string &svg);

protected:
  void computeShape() override;

private:
  RevolutionProps m_props;
  TopoDS_Shape m_profile;
  Standard_Boolean m_profileChanged;
};

#endif
