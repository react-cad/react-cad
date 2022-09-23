#ifndef BRepImportNode_HeaderFile
#define BRepImportNode_HeaderFile

#include "ImportNode.hpp"

class BRepImportNode : public ImportNode
{
public:
  BRepImportNode();

protected:
  void importFile() override;
};

#endif
