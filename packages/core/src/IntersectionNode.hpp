#ifndef IntersectionNode_HeaderFile
#define IntersectionNode_HeaderFile

#include "ReactCADNode.hpp"

#include <TopTools_ListOfShape.hxx>

class IntersectionNode : public ReactCADNode
{
public:
  IntersectionNode();

  std::string getName() override
  {
    return "Intersection";
  }

protected:
  void computeChildren(TopTools_ListOfShape children, const ProgressHandler &handler) override;
};

#endif
