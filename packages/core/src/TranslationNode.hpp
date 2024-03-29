#ifndef TranslationNode_HeaderFile
#define TranslationNode_HeaderFile

#include "ReactCADNode.hpp"

#include <gp_Vec.hxx>

class TranslationNode : public ReactCADNode
{
public:
  TranslationNode();
  void setVector(gp_Vec vector);

  std::string getName() override
  {
    return "Translation";
  }

protected:
  void computeShape(const ProgressHandler &handler) override;

private:
  gp_Vec m_vector;
};

#endif
