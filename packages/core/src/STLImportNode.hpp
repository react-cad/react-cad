#ifndef STLImportNode_HeaderFile
#define STLImportNode_HeaderFile

#include "ImportNode.hpp"

class STLImportNode : public ImportNode
{
public:
  STLImportNode();

  std::string getName() override
  {
    return "STLImport";
  }

protected:
  TopoDS_Shape importFile(const ProgressHandler &handler) override;
};

#endif
