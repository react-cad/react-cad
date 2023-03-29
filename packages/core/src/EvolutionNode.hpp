#ifndef EvolutionNode_HeaderFile
#define EvolutionNode_HeaderFile

#include "ReactCADNode.hpp"
#include "SVGPathBuilder.hpp"

#include <NCollection_Array1.hxx>
#include <gp_Pnt.hxx>

class EvolutionNode : public ReactCADNode
{
public:
  EvolutionNode();
  void setProfile(const std::string &pathData);

  std::string getName() override
  {
    return "Evolution";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  Handle(SVGPathBuilder) m_profileBuilder;
};

#endif
