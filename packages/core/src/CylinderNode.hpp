#ifndef CylinderNode_HeaderFile
#define CylinderNode_HeaderFile

#include "ReactCADNode.hpp"

struct CylinderProps
{
  bool center;
  double radius;
  double height;
  double angle;
};

class CylinderNode : public ReactCADNode
{
public:
  CylinderNode();
  void setProps(const CylinderProps &props);

protected:
  void computeShape() override;

private:
  CylinderProps m_props;
};

#endif
