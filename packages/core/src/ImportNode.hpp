#ifndef ImportNode_HeaderFile
#define ImportNode_HeaderFile

#include <string>

#include "ReactCADNode.hpp"

class ImportNode : public ReactCADNode
{
public:
  ImportNode();
  virtual ~ImportNode();
  void setSrc(const std::string &src);

protected:
  void computeShape() override;
  virtual void parseSrc(std::string &src) = 0;

private:
  std::string m_src;
};

#endif
