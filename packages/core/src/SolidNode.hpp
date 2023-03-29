#ifndef SolidNode_HeaderFile
#define SolidNode_HeaderFile

#include "ReactCADNode.hpp"

class SolidNode : public ReactCADNode
{
public:
  SolidNode();

  std::string getName() override
  {
    return "Solid";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;
};

#endif
