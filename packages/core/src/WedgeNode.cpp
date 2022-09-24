#include <BRepPrimAPI_MakeWedge.hxx>
#include <gp_Pnt.hxx>

#include "WedgeNode.hpp"

WedgeNode::WedgeNode()
    : m_propsLtx({.x = 1, .y = 1, .z = 1, .ltx = 1}),
      m_propsMinMax({.x = 1, .y = 1, .z = 1, .xmin = 1, .xmax = 1, .zmin = 1, .zmax = 1})
{
}

void WedgeNode::setPropsLtx(const WedgePropsLtx &props)
{
  if (!IsEqual(props.x, m_propsLtx.x) || !IsEqual(props.y, m_propsLtx.y) || !IsEqual(props.z, m_propsLtx.z) ||
      !IsEqual(props.ltx, m_propsLtx.ltx))
  {
    useLtx = true;
    m_propsLtx = props;
    propsChanged();
  }
}

void WedgeNode::setPropsMinMax(const WedgePropsMinMax &props)
{
  if (!IsEqual(props.x, m_propsMinMax.x) || !IsEqual(props.y, m_propsMinMax.y) || !IsEqual(props.z, m_propsMinMax.z) ||
      !IsEqual(props.xmin, m_propsMinMax.xmin) || !IsEqual(props.xmax, m_propsMinMax.xmax) ||
      !IsEqual(props.zmin, m_propsMinMax.zmin) || !IsEqual(props.zmax, m_propsMinMax.zmax))
  {
    useLtx = false;
    m_propsMinMax = props;
    propsChanged();
  }
}

void WedgeNode::computeShape()
{
  TopoDS_Solid wedge;

  if (useLtx)
  {
    wedge = BRepPrimAPI_MakeWedge(m_propsLtx.x, m_propsLtx.y, m_propsLtx.z, m_propsLtx.ltx);
  }
  else
  {
    wedge = BRepPrimAPI_MakeWedge(m_propsMinMax.x, m_propsMinMax.y, m_propsMinMax.z, m_propsMinMax.xmin,
                                  m_propsMinMax.zmin, m_propsMinMax.xmax, m_propsMinMax.zmax);
  }

  shape = wedge;
}
