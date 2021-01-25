#ifndef SphereNode_HeaderFile
#define SphereNode_HeaderFile

#include "ReactCADNode.h"

struct SphereProps
{
  double radius;
};

class SphereNode : public ReactCADNode
{
public:
  SphereNode();
  virtual ~SphereNode();
  void setProps(const SphereProps &prop);

protected:
  void renderShape() override;

private:
  SphereProps m_props;
};

#endif
