#ifndef BoxNode_HeaderFile
#define BoxNode_HeaderFile

#include "ReactCADNode.hpp"

#include <gp_Pnt.hxx>

class BoxNode : public ReactCADNode
{
public:
  BoxNode();
  void setSize(gp_Pnt size);
  void setCentered(Standard_Boolean centered);

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  gp_Pnt m_size;
  Standard_Boolean m_centered;
};

#endif
