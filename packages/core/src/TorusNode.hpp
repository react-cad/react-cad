#ifndef TorusNode_HeaderFile
#define TorusNode_HeaderFile

#include "ReactCADNode.hpp"

struct TorusProps
{
  double radius1;
  double radius2;
  double angle;
};

class TorusNode : public ReactCADNode
{
public:
  TorusNode();
  virtual ~TorusNode();
  void setProps(const TorusProps &props);

protected:
  void computeShape() override;

private:
  TorusProps m_props;
};

#endif
