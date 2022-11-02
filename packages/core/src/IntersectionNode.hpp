#ifndef IntersectionNode_HeaderFile
#define IntersectionNode_HeaderFile

#include "ReactCADNode.hpp"

#include <TopTools_ListOfShape.hxx>

class IntersectionNode : public ReactCADNode
{
public:
  IntersectionNode();

protected:
  bool computeChildren(TopTools_ListOfShape children,
                       const Message_ProgressRange &theRange = Message_ProgressRange()) override;
};

#endif
