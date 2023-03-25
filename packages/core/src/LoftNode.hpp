#ifndef LoftNode_HeaderFile
#define LoftNode_HeaderFile

#include <BRepOffsetAPI_ThruSections.hxx>

#include <memory>

#include "ReactCADNode.hpp"

class LoftNode : public ReactCADNode
{
public:
  LoftNode();

  void setExact(Standard_Boolean exact);
  void setSmooth(Standard_Boolean smooth);

  std::string getName() override
  {
    return "Loft";
  }

protected:
  void computeChildren(TopTools_ListOfShape children, const ProgressHandler &handler) override;
  void computeShape(const ProgressHandler &handler) override;

private:
  std::shared_ptr<BRepOffsetAPI_ThruSections> createLoft();
  TopoDS_Shape buildLoft(const std::shared_ptr<BRepOffsetAPI_ThruSections> &loft, const ProgressHandler &handler);

  Standard_Boolean m_exact;
  Standard_Boolean m_smooth;
  TopTools_ListOfShape m_children;
};

#endif
