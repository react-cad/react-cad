#ifndef CylinderNode_HeaderFile
#define CylinderNode_HeaderFile

#include "ReactCADNode.h"

struct CylinderProps
{
  bool center;
  double radius;
  double height;
};

class CylinderNode : public ReactCADNode
{
public:
  CylinderNode();
  virtual ~CylinderNode();
  void setProps(const CylinderProps &props);

protected:
  void renderShape() override;

private:
  CylinderProps m_props;
};

#endif
