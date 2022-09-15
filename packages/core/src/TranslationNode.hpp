#ifndef TranslationNode_HeaderFile
#define TranslationNode_HeaderFile

#include "ReactCADNode.hpp"

struct TranslationProps
{
  double x;
  double y;
  double z;
};

class TranslationNode : public ReactCADNode
{
public:
  TranslationNode();
  virtual ~TranslationNode();
  void setProps(const TranslationProps &props);

protected:
  void computeShape() override;

private:
  TranslationProps m_props;
};

#endif
