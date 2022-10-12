#ifndef PipeNode_HeaderFile
#define PipeNode_HeaderFile

#include "Geometry.hpp"
#include "SweepNode.hpp"

#include <NCollection_Array1.hxx>
#include <TopoDS_Wire.hxx>
#include <gp_Pnt.hxx>

class PipeNode : public SweepNode
{
public:
  PipeNode();
  void setSpine(const NCollection_Array1<gp_Pnt> &points);
  void setSpineSVG(const std::string &svg);

protected:
  void computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  Handle(ShapeBuilder) m_spineBuilder;
};

#endif
