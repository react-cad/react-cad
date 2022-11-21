#ifndef AffineNode_HeaderFile
#define AffineNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <gp_GTrsf.hxx>

class AffineNode : public ReactCADNode
{
public:
  AffineNode();
  void setMatrix(Matrix matrix);
  std::string getName() override
  {
    return "Affine";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  gp_GTrsf m_transform;
};

#endif
