#ifndef BRepImportNode_HeaderFile
#define BRepImportNode_HeaderFile

#include "ImportNode.hpp"

class BRepImportNode : public ImportNode
{
public:
  BRepImportNode();

  std::string getName() override
  {
    return "BRepImport";
  }

protected:
  void importFile(const ProgressHandler &handler) override;
};

#endif
