#ifndef ImportNode_HeaderFile
#define ImportNode_HeaderFile

#include <string>

#include "ReactCADNode.hpp"

class ImportNode : public ReactCADNode
{
public:
  ImportNode();
  ~ImportNode();

  void setFilename(const std::string &filename, bool ownFile = false);
  std::string getFilename();

protected:
  std::string m_filename;
  void computeShape() override;
  virtual void importFile() = 0;

private:
  bool m_ownFile = false;
  void removeFile();
};

#endif
