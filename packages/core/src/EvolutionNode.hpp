#ifndef EvolutionNode_HeaderFile
#define EvolutionNode_HeaderFile

#include "SweepNode.hpp"

#include <NCollection_Array1.hxx>

class EvolutionNode : public ReactCADNode
{
public:
  EvolutionNode();
  void setSpine(const NCollection_Array1<Point> &points);
  void setSpineSVG(const std::string &svg);
  void setProfile(const NCollection_Array1<Point> &points);
  void setProfileSVG(const std::string &pathData);

protected:
  void computeShape() override;

private:
  TopoDS_Wire m_profile;
  TopoDS_Shape m_spine;
};

#endif
