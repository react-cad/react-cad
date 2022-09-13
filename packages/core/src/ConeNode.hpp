#ifndef ConeNode_HeaderFile
#define ConeNode_HeaderFile

#include "ReactCADNode.hpp"

struct ConeProps
{
  bool center;
  double radius1;
  double radius2;
  double height;
  double angle;
};

class ConeNode : public ReactCADNode
{
public:
  ConeNode();
  virtual ~ConeNode();
  void setProps(const ConeProps &props);

protected:
  void computeShape() override;

private:
  ConeProps m_props;
};

#endif
