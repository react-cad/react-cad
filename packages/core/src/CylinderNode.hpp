#ifndef CylinderNode_HeaderFile
#define CylinderNode_HeaderFile

#include "ReactCADNode.hpp"

class CylinderNode : public ReactCADNode
{
public:
  CylinderNode();
  void setSize(Standard_Real radius, Standard_Real height);
  void setAngle(Standard_Real angle);
  void setCentered(Standard_Boolean centered);

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  Standard_Real m_radius;
  Standard_Real m_height;
  Standard_Real m_angle;
  Standard_Boolean m_centered;
};

#endif
