#ifndef SweepNode_HeaderFile
#define SweepNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <NCollection_Array1.hxx>
#include <TopoDS_Shape.hxx>
#include <TopoDS_Wire.hxx>
#include <gp_Pnt.hxx>

#include "ShapeBuilder.hpp"

#include <utility>

class SweepNode : public ReactCADNode
{
public:
  SweepNode();
  void setProfile(const NCollection_Array1<gp_Pnt> &points);
  void setProfileSVG(const std::string &svg);

protected:
  TopoDS_Shape getProfile();

private:
  Handle(ShapeBuilder) m_profileBuilder;
};

#endif
