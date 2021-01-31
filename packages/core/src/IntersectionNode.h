#ifndef IntersectionNode_HeaderFile
#define IntersectionNode_HeaderFile

#include "ReactCADNode.h"

class IntersectionNode : public ReactCADNode
{
public:
  IntersectionNode();
  virtual ~IntersectionNode();

protected:
  void renderChildren(const std::vector<TopoDS_Shape> &children) override;

private:
  TopoDS_Shape common(const std::vector<TopoDS_Shape> &children);
};

#endif
