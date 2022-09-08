#ifndef CylinderNode_HeaderFile
#define CylinderNode_HeaderFile

#include "ReactCADNode.hpp"

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
  void computeShape() override;

private:
  CylinderProps m_props;
};

#endif
