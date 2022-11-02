#ifndef RevolutionNode_HeaderFile
#define RevolutionNode_HeaderFile

#include "Geometry.hpp"
#include "SweepNode.hpp"

#include <string>

#include <TopoDS_Shape.hxx>
#include <gp_Vec.hxx>

class RevolutionNode : public SweepNode
{
public:
  RevolutionNode();
  void setAxisAngle(gp_Vec direction, Standard_Real angle);

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  gp_Vec m_axis;
  Standard_Real m_angle;
};

#endif
