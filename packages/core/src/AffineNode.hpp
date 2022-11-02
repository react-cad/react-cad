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

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  gp_GTrsf m_transform;
};

#endif
