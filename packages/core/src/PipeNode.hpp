#ifndef PipeNode_HeaderFile
#define PipeNode_HeaderFile

#include "Geometry.hpp"
#include "SweepNode.hpp"

#include <TopoDS_Wire.hxx>

class PipeNode : public SweepNode
{
public:
  PipeNode();
  void setSpine(const std::vector<Point> &points);
  void setSpineSVG(const std::string &svg);

protected:
  void computeShape() override;

private:
  TopoDS_Wire m_spine;

  TopoDS_Shape makePipe(const TopoDS_Wire &profile);
};

#endif
