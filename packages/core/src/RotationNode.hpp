#ifndef RotationNode_HeaderFile
#define RotationNode_HeaderFile

#include <string>

#include <Standard_Real.hxx>
#include <gp_Dir.hxx>
#include <gp_Quaternion.hxx>
#include <gp_Trsf.hxx>

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

class RotationNode : public ReactCADNode
{
public:
  RotationNode();
  void setAxisAngle(gp_Vec axis, Standard_Real angle);
  void setEulerAngles(Standard_Real xAngle, Standard_Real yAngle, Standard_Real zAngle);
  void setRotation(Quaternion quaternion);

  std::string getName() override
  {
    return "Rotation";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  Standard_Real m_angle;
  gp_Dir m_axis;
  gp_Quaternion m_quaternion;
  gp_Trsf m_transform;
};

#endif
