#ifndef AffineNode_HeaderFile
#define AffineNode_HeaderFile

#include "Geometry.hpp"
#include "TransformationNode.hpp"

class AffineNode : public TransformationNode
{
public:
  AffineNode();
  virtual ~AffineNode();
  void setMatrix(Matrix matrix);
};

#endif
