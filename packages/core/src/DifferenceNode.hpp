#ifndef DifferenceNode_HeaderFile
#define DifferenceNode_HeaderFile

#include "ReactCADNode.hpp"

class DifferenceNode : public ReactCADNode
{
public:
  DifferenceNode();
  virtual ~DifferenceNode();

protected:
  void computeChildren(const std::vector<TopoDS_Shape> &children) override;

private:
  TopoDS_Shape cut(const std::vector<TopoDS_Shape> &children);
};

#endif
