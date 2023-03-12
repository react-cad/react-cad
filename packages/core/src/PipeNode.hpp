#ifndef PipeNode_HeaderFile
#define PipeNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"
#include "SVGPathBuilder.hpp"

#include <NCollection_Array1.hxx>
#include <TopoDS_Shape.hxx>
#include <gp_Pnt.hxx>

class PipeNode : public ReactCADNode
{
public:
  PipeNode();
  void setSpine(const std::string &svg);

  std::string getName() override
  {
    return "Pipe";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  Handle(SVGPathBuilder) m_spineBuilder;
  bool makePipe(const TopoDS_Shape &profile, const TopoDS_Shape &spine, TopoDS_Shape &shape);
};

#endif
