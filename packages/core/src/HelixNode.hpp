#ifndef HelixNode_HeaderFile
#define HelixNode_HeaderFile

#include "Geometry.hpp"
#include "SweepNode.hpp"

#include <TopoDS_Wire.hxx>

class HelixNode : public SweepNode
{
public:
  HelixNode();
  void setPitch(Standard_Real pitch);
  void setHeight(Standard_Real height);

protected:
  void computeShape() override;

private:
  void buildSpineAndGuide();

  Standard_Real m_pitch;
  Standard_Real m_height;

  TopoDS_Wire m_spine;
  TopoDS_Wire m_guide;

  TopoDS_Shape makeHelix(const TopoDS_Wire &profile);
};

#endif
