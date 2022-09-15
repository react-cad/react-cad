#ifndef ScaleNode_HeaderFile
#define ScaleNode_HeaderFile

#include "TransformationNode.hpp"

#include "Geometry.hpp"

#include <Standard_Boolean.hxx>
#include <Standard_Real.hxx>

class ScaleNode : public TransformationNode
{
public:
  ScaleNode();
  virtual ~ScaleNode();
  void setScaleFactor(Standard_Real scaleFactor);
  void setScale(Vector scale);
  void setCenter(Point center);

protected:
  void computeShape() override;

private:
  gp_Pnt m_center;
  Standard_Real m_scaleX = 1;
  Standard_Real m_scaleY = 1;
  Standard_Real m_scaleZ = 1;
};

#endif
