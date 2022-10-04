#ifndef MirrorNode_HeaderFile
#define MirrorNode_HeaderFile

#include "Geometry.hpp"
#include "ReactCADNode.hpp"

#include <gp_Ax2.hxx>
#include <gp_Pnt.hxx>
#include <gp_Trsf.hxx>
#include <gp_Vec.hxx>

class MirrorNode : public ReactCADNode
{
public:
  MirrorNode();
  void setPlane(gp_Pnt origin, gp_Vec normal);

protected:
  void computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  gp_Trsf m_trsf;
  gp_Ax2 m_axis;
};

#endif
