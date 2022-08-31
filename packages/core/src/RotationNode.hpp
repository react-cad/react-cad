#ifndef RotationNode_HeaderFile
#define RotationNode_HeaderFile

#include <string>

#include "TransformationNode.hpp"

struct RotationProps
{
  std::string axis;
  double angle;
};

class RotationNode : public TransformationNode
{
public:
  RotationNode();
  virtual ~RotationNode();
  void setProps(const RotationProps &props);

private:
  RotationProps m_props;
};

#endif
