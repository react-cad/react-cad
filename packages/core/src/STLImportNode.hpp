#ifndef STLImportNode_HeaderFile
#define STLImportNode_HeaderFile

#include "ImportNode.hpp"

class STLImportNode : public ImportNode
{
public:
  STLImportNode();
  ~STLImportNode();

protected:
  void importFile() override;
};

#endif
