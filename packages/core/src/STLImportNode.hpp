#ifndef STLImportNode_HeaderFile
#define STLImportNode_HeaderFile

#include "ImportNode.hpp"

class STLImportNode : public ImportNode
{
public:
  STLImportNode();

protected:
  void importFile() override;
};

#endif
