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
  void importFile(const ProgressHandler &handler) override;
};

#endif
