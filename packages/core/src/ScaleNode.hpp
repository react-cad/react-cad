#ifndef ScaleNode_HeaderFile
#define ScaleNode_HeaderFile

#include "ReactCADNode.hpp"

#include "Geometry.hpp"

#include <Standard_Boolean.hxx>
#include <Standard_Real.hxx>
#include <gp_Pnt.hxx>
#include <gp_Vec.hxx>

class ScaleNode : public ReactCADNode
{
public:
  ScaleNode();
  void setScaleFactor(Standard_Real scaleFactor);
  void setScale(gp_Vec scale);
  void setCenter(gp_Pnt center);

  std::string getName() override
  {
    return "Scale";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  gp_Pnt m_center;
  Standard_Real m_scaleX = 1;
  Standard_Real m_scaleY = 1;
  Standard_Real m_scaleZ = 1;
};

#endif
