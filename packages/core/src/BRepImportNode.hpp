#ifndef BRepImportNode_HeaderFile
#define BRepImportNode_HeaderFile

#include "ImportNode.hpp"

class BRepImportNode : public ImportNode
{
public:
  BRepImportNode();

protected:
  bool importFile(const Message_ProgressRange &theRange = Message_ProgressRange()) override;
};

#endif
