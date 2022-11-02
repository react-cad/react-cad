#ifndef TorusNode_HeaderFile
#define TorusNode_HeaderFile

#include "ReactCADNode.hpp"

class TorusNode : public ReactCADNode
{
public:
  TorusNode();
  void setSize(Standard_Real radius1, Standard_Real radius2);
  void setAngle(Standard_Real angle);

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  Standard_Real m_radius1;
  Standard_Real m_radius2;
  Standard_Real m_angle;
};

#endif
