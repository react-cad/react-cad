#ifndef STEPImportNode_HeaderFile
#define STEPImportNode_HeaderFile

#include "ImportNode.hpp"

class STEPImportNode : public ImportNode
{
public:
  STEPImportNode();
  ~STEPImportNode();

protected:
  void importFile() override;
};

#endif
