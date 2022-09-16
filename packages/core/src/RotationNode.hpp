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
  virtual ~RotationNode();
  void setAxisAngle(Vector direction, Standard_Real angle);
  void setEulerAngles(Standard_Real xAngle, Standard_Real yAngle, Standard_Real zAngle);
  void setRotation(Quaternion quaternion);

protected:
  void computeShape() override;

private:
  void setTransform();
  void setDirectionAngle(gp_Dir direction, Standard_Real angle);
  Standard_Real m_angle;
  gp_Dir m_axis;
  gp_Quaternion m_quaternion;
  gp_Trsf m_transform;
};

#endif
