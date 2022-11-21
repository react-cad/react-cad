#ifndef DifferenceNode_HeaderFile
#define DifferenceNode_HeaderFile

#include "ReactCADNode.hpp"

#include <TopTools_ListOfShape.hxx>

class DifferenceNode : public ReactCADNode
{
public:
  DifferenceNode();

  std::string getName() override
  {
    return "Difference";
  }

protected:
  void computeChildren(TopTools_ListOfShape children, const ProgressHandler &handler) override;
};

#endif
