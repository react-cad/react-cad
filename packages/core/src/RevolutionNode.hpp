#ifndef RevolutionNode_HeaderFile
#define RevolutionNode_HeaderFile

#include "SweepNode.hpp"

struct RevolutionProps
{
  std::string axis;
  double angle;
};

class RevolutionNode : public SweepNode
{
public:
  RevolutionNode();
  virtual ~RevolutionNode();
  void setProps(const RevolutionProps &props);

protected:
  void renderShape() override;

private:
  RevolutionProps m_props;
};

#endif
