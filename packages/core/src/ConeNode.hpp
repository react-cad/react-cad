#ifndef ConeNode_HeaderFile
#define ConeNode_HeaderFile

#include "ReactCADNode.hpp"

class ConeNode : public ReactCADNode
{
public:
  ConeNode();
  void setCentered(Standard_Boolean centered);
  void setSize(Standard_Real radius1, Standard_Real radius2, Standard_Real height);
  void setAngle(Standard_Real angle);

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  Standard_Boolean m_centered;
  Standard_Real m_radius1;
  Standard_Real m_radius2;
  Standard_Real m_height;
  Standard_Real m_angle;
};

#endif
