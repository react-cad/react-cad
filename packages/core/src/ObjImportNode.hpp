#ifndef ObjImportNode_HeaderFile
#define ObjImportNode_HeaderFile

#include "ImportNode.hpp"

class ObjImportNode : public ImportNode
{
public:
  ObjImportNode();

protected:
  void importFile() override;
};

#endif
