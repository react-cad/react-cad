#ifndef TransformationNode_HeaderFile
#define TransformationNode_HeaderFile

#include "ReactCADNode.h"

#include <gp.hxx>
#include <gp_Trsf.hxx>

class TransformationNode : public ReactCADNode
{
public:
  TransformationNode();
  virtual ~TransformationNode();

protected:
  void renderShape() override;

protected:
  gp_Trsf m_transform;
};

#endif
