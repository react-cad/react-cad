#ifndef HelixNode_HeaderFile
#define HelixNode_HeaderFile

#include "SweepNode.hpp"

struct HelixProps
{
  double pitch;
  double height;
};

class HelixNode : public SweepNode
{
public:
  HelixNode();
  virtual ~HelixNode();
  void setProps(const HelixProps &props);

protected:
  void computeShape() override;

private:
  HelixProps m_props;
  bool m_pitchOrHeightChanged = false;

  TopoDS_Shape makeHelix(TopoDS_Wire profile);
};

#endif
