#ifndef EvolutionNode_HeaderFile
#define EvolutionNode_HeaderFile

#include "SweepNode.hpp"

#include <NCollection_Array1.hxx>
#include <gp_Pnt.hxx>

class EvolutionNode : public ReactCADNode
{
public:
  EvolutionNode();
  void setSpine(const NCollection_Array1<gp_Pnt> &points);
  void setSpineSVG(const std::string &svg);
  void setProfile(const NCollection_Array1<gp_Pnt> &points);
  void setProfileSVG(const std::string &pathData);

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  Handle(ShapeBuilder) m_spineBuilder;
  Handle(ShapeBuilder) m_profileBuilder;
};

#endif
