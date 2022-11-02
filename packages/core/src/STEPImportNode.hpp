#ifndef STEPImportNode_HeaderFile
#define STEPImportNode_HeaderFile

#include "ImportNode.hpp"

class STEPImportNode : public ImportNode
{
public:
  STEPImportNode();

protected:
  bool importFile(const Message_ProgressRange &theRange = Message_ProgressRange()) override;
};

#endif
