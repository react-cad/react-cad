#ifndef EvolutionNode_HeaderFile
#define EvolutionNode_HeaderFile

#include "SweepNode.hpp"

class EvolutionNode : public ReactCADNode
{
public:
  EvolutionNode();
  void setSpine(const std::vector<Point> &points);
  void setSpineSVG(const std::string &pathData);
  void setProfile(const std::vector<Point> &points);
  void setProfileSVG(const std::string &svg);

protected:
  void computeShape() override;

private:
  TopoDS_Wire m_profile;
  TopoDS_Wire m_spine;
};

#endif
