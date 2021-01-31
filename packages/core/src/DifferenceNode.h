#ifndef DifferenceNode_HeaderFile
#define DifferenceNode_HeaderFile

#include "ReactCADNode.h"

class DifferenceNode : public ReactCADNode
{
public:
  DifferenceNode();
  virtual ~DifferenceNode();

protected:
  void renderChildren(const std::vector<TopoDS_Shape> &children) override;

private:
  TopoDS_Shape cut(const std::vector<TopoDS_Shape> &children);
};

#endif
