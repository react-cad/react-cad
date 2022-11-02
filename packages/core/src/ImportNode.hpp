#ifndef ImportNode_HeaderFile
#define ImportNode_HeaderFile

#include <emscripten/val.h>
#include <string>

#include "ReactCADNode.hpp"

class ImportNode : public ReactCADNode
{
public:
  ImportNode();
  ImportNode(const ImportNode &other);
  ImportNode &operator=(const ImportNode &other);
  ~ImportNode() override;

  void setFileContents(emscripten::val contents);

protected:
  bool computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

  std::string m_filename;
  virtual bool importFile(const Message_ProgressRange &theRange) = 0;
};

#endif
