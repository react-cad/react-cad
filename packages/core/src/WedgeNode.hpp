#ifndef WedgeNode_HeaderFile
#define WedgeNode_HeaderFile

#include "ReactCADNode.hpp"

struct WedgePropsLtx
{
  double x;
  double y;
  double z;
  double ltx;
};

struct WedgePropsMinMax
{
  double x;
  double y;
  double z;
  double xmin;
  double xmax;
  double zmin;
  double zmax;
};

class WedgeNode : public ReactCADNode
{
public:
  WedgeNode();
  void setPropsLtx(const WedgePropsLtx &props);
  void setPropsMinMax(const WedgePropsMinMax &props);

protected:
  void computeShape() override;

private:
  bool useLtx = true;
  WedgePropsLtx m_propsLtx;
  WedgePropsMinMax m_propsMinMax;
};

#endif
