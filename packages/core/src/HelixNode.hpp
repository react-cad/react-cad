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

  std::string getName() override
  {
    return "Helix";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  void buildSpineAndGuide();

  Standard_Real m_pitch;
  Standard_Real m_height;

  TopoDS_Wire m_spine;
  TopoDS_Wire m_guide;

  bool makeHelix(const TopoDS_Wire &profile, TopoDS_Shape &shape);
};

#endif
