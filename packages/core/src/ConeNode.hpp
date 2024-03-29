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

  std::string getName() override
  {
    return "Cone";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  Standard_Boolean m_centered;
  Standard_Real m_radius1;
  Standard_Real m_radius2;
  Standard_Real m_height;
  Standard_Real m_angle;
};

#endif
