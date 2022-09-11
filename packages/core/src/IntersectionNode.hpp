#ifndef IntersectionNode_HeaderFile
#define IntersectionNode_HeaderFile

#include "ReactCADNode.hpp"

#include <TopTools_ListOfShape.hxx>

class IntersectionNode : public ReactCADNode
{
public:
  IntersectionNode();
  virtual ~IntersectionNode();

protected:
  void computeChildren(TopTools_ListOfShape children) override;
};

#endif
