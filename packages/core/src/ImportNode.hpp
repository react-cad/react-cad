#ifndef ImportNode_HeaderFile
#define ImportNode_HeaderFile

#include <emscripten/val.h>
#include <string>

#include "ReactCADNode.hpp"

// TODO: copy assignment, copy constructor
class ImportNode : public ReactCADNode
{
public:
  ImportNode();
  ~ImportNode();

  void setFileContents(emscripten::val contents);

protected:
  void setFilename(const std::string &filename, bool ownFile = false);
  std::string m_filename;
  void computeShape() override;
  virtual void importFile() = 0;

private:
  bool m_ownFile = false;
  void removeFile();
};

#endif
