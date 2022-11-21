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

  std::string getName() override
  {
    return "Box";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  gp_Pnt m_size;
  Standard_Boolean m_centered;
};

#endif
