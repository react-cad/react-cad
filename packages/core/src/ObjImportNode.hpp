#ifndef ObjImportNode_HeaderFile
#define ObjImportNode_HeaderFile

#include "ImportNode.hpp"

class ObjImportNode : public ImportNode
{
public:
  ObjImportNode();

  std::string getName() override
  {
    return "ObjImport";
  }

protected:
  TopoDS_Shape importFile(const ProgressHandler &handler) override;
};

#endif
