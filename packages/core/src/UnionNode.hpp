#ifndef UnionNode_HeaderFile
#define UnionNode_HeaderFile

#include "ReactCADNode.hpp"

class UnionNode : public ReactCADNode
{
public:
  UnionNode();

  std::string getName() override
  {
    return "Union";
  }
};

#endif
