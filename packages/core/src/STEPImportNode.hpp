#ifndef STEPImportNode_HeaderFile
#define STEPImportNode_HeaderFile

#include "ImportNode.hpp"

class STEPImportNode : public ImportNode
{
public:
  STEPImportNode();

  std::string getName() override
  {
    return "STEPImport";
  }

protected:
  void importFile(const ProgressHandler &handler) override;
};

#endif
