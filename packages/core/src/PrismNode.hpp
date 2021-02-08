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
  double m_sectionHeight;
  PrismProps m_props;
  bool m_heightChanged = false;
  bool m_axisChanged = false;
  TopoDS_Shape m_section;
  bool m_sectionChanged = false;

  void computeSection();
};

#endif
