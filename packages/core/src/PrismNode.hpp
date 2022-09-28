#ifndef PrismNode_HeaderFile
#define PrismNode_HeaderFile

#include "Geometry.hpp"
#include "SweepNode.hpp"

#include <gp_Vec.hxx>

class PrismNode : public SweepNode
{
public:
  PrismNode();
  void setVector(gp_Vec vector);

protected:
  void computeShape() override;

private:
  gp_Vec m_vector;
};

#endif
