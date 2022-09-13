#ifndef SphereNode_HeaderFile
#define SphereNode_HeaderFile

#include "ReactCADNode.hpp"

struct SphereProps
{
  double radius;
  double angle;
  double segmentAngle1;
  double segmentAngle2;
};

class SphereNode : public ReactCADNode
{
public:
  SphereNode();
  virtual ~SphereNode();
  void setProps(const SphereProps &prop);

protected:
  void computeShape() override;

private:
  SphereProps m_props;
};

#endif
