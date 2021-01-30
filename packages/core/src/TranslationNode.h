#ifndef TranslationNode_HeaderFile
#define TranslationNode_HeaderFile

#include "TransformationNode.h"

struct TranslationProps
{
  double x;
  double y;
  double z;
};

class TranslationNode : public TransformationNode
{
public:
  TranslationNode();
  virtual ~TranslationNode();
  void setProps(const TranslationProps &props);

protected:
  TranslationProps m_props;
};

#endif
