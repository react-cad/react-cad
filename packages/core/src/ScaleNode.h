#ifndef ScaleNode_HeaderFile
#define ScaleNode_HeaderFile

#include "TransformationNode.h"

struct ScaleProps
{
  double factor;
};

class ScaleNode : public TransformationNode
{
public:
  ScaleNode();
  virtual ~ScaleNode();
  void setProps(const ScaleProps &props);

protected:
  ScaleProps m_props;
};

#endif
