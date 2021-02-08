#ifndef DifferenceNode_HeaderFile
#define DifferenceNode_HeaderFile

#include "ReactCADNode.hpp"

#include <TopTools_ListOfShape.hxx>

class DifferenceNode : public ReactCADNode
{
public:
  DifferenceNode();
  virtual ~DifferenceNode();

protected:
  void computeChildren(TopTools_ListOfShape children) override;
};

#endif
