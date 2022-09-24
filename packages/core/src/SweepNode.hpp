#ifndef SweepNode_HeaderFile
#define SweepNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <NCollection_Array1.hxx>
#include <TopoDS_Shape.hxx>
#include <TopoDS_Wire.hxx>

#include <utility>

class SweepNode : public ReactCADNode
{
public:
  SweepNode();
  void setProfile(const NCollection_Array1<Point> &points);
  void setProfileSVG(const std::string &svg);

protected:
  TopoDS_Shape m_profile;
  Standard_Boolean m_profileChanged = false;

private:
  NCollection_Array1<Point> m_points;
  std::string m_svg;
  Standard_Boolean m_isSVG;
};

#endif
