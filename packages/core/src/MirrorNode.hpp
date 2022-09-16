#ifndef MirrorNode_HeaderFile
#define MirrorNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <gp_Ax2.hxx>
#include <gp_Trsf.hxx>

class MirrorNode : public ReactCADNode
{
public:
  MirrorNode();
  virtual ~MirrorNode();
  void setPlane(Point origin, Vector normal);

protected:
  void computeShape() override;

private:
  gp_Trsf m_trsf;
  gp_Ax2 m_axis;
};

#endif
