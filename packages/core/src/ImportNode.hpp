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

  std::string getName() override
  {
    return "Import";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

  std::string m_filename;
  virtual void importFile(const ProgressHandler &handler) = 0;
};

#endif
