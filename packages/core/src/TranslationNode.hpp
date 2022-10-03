#ifndef TranslationNode_HeaderFile
#define TranslationNode_HeaderFile

#include "ReactCADNode.hpp"

#include <gp_Vec.hxx>

class TranslationNode : public ReactCADNode
{
public:
  TranslationNode();
  void setVector(gp_Vec vector);

protected:
  void computeShape(const Message_ProgressRange &theRange = Message_ProgressRange()) override;

private:
  gp_Vec m_vector;
};

#endif
