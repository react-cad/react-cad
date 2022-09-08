#ifndef PrismNode_HeaderFile
#define PrismNode_HeaderFile

#include "SweepNode.hpp"

struct PrismProps
{
  std::string axis;
  double height;
};

class PrismNode : public SweepNode
{
public:
  PrismNode();
  virtual ~PrismNode();
  void setProps(const PrismProps &props);

protected:
  void computeShape() override;

private:
  PrismProps m_props;
};

#endif
