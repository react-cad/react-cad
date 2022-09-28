#ifndef SphereNode_HeaderFile
#define SphereNode_HeaderFile

#include "ReactCADNode.hpp"

class SphereNode : public ReactCADNode
{
public:
  SphereNode();
  void setRadius(Standard_Real radius);
  void setAngle(Standard_Real angle);
  void setSegment(Standard_Real angle1, Standard_Real angle2);

protected:
  void computeShape() override;

private:
  Standard_Real m_radius;
  Standard_Real m_angle;
  Standard_Real m_segmentAngle1;
  Standard_Real m_segmentAngle2;
};

#endif
