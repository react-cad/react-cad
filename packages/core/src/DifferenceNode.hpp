#ifndef DifferenceNode_HeaderFile
#define DifferenceNode_HeaderFile

#include "ReactCADNode.hpp"

#include <TopTools_ListOfShape.hxx>

class DifferenceNode : public ReactCADNode
{
public:
  DifferenceNode();

protected:
  void computeChildren(TopTools_ListOfShape children,
                       const Message_ProgressRange &theRange = Message_ProgressRange()) override;
};

#endif
