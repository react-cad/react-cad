#ifndef WedgeNode_HeaderFile
#define WedgeNode_HeaderFile

#include "ReactCADNode.hpp"

#include <gp_Pnt.hxx>

class WedgeNode : public ReactCADNode
{
public:
  WedgeNode();
  void setSize(gp_Pnt size);
  void setLtx(Standard_Real ltx);
  void setMinMax(Standard_Real xmin, Standard_Real xmax, Standard_Real zmin, Standard_Real zmax);

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  Standard_Boolean m_useLtx;

  gp_Pnt m_size;
  Standard_Real m_ltx;

  Standard_Real m_xmin;
  Standard_Real m_xmax;
  Standard_Real m_zmin;
  Standard_Real m_zmax;
};

#endif
