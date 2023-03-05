#ifndef PipeNode_HeaderFile
#define PipeNode_HeaderFile

#include "Geometry.hpp"
#include "SweepNode.hpp"

#include <NCollection_Array1.hxx>
#include <TopoDS_Shape.hxx>
#include <gp_Pnt.hxx>

class PipeNode : public SweepNode
{
public:
  PipeNode();
  void setSpine(const NCollection_Array1<gp_Pnt> &points);
  void setSpineSVG(const std::string &svg);

  std::string getName() override
  {
    return "Pipe";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  Handle(ShapeBuilder) m_spineBuilder;
  bool makePipe(const TopoDS_Shape &profile, const TopoDS_Shape &spine, TopoDS_Shape &shape);
};

#endif
