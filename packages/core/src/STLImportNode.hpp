#ifndef STLImportNode_HeaderFile
#define STLImportNode_HeaderFile

#include "ImportNode.hpp"

class STLImportNode : public ImportNode
{
public:
  STLImportNode();

protected:
  void importFile(const Message_ProgressRange &theRange = Message_ProgressRange()) override;
};

#endif
