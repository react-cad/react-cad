#ifndef BoxNode_HeaderFile
#define BoxNode_HeaderFile

#include "ReactCADNode.hpp"

struct BoxProps
{
  bool center;
  double x;
  double y;
  double z;
};

class BoxNode : public ReactCADNode
{
public:
  BoxNode();
  virtual ~BoxNode();
  void setProps(const BoxProps &props);

protected:
  void renderShape() override;

private:
  BoxProps m_props;
};

#endif
