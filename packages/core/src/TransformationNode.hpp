#ifndef TransformationNode_HeaderFile
#define TransformationNode_HeaderFile

#include "ReactCADNode.hpp"

#include <gp.hxx>
#include <gp_GTrsf.hxx>

class TransformationNode : public ReactCADNode
{
public:
  TransformationNode();
  virtual ~TransformationNode();

protected:
  void computeShape() override;

protected:
  gp_GTrsf m_transform;
};

#endif
