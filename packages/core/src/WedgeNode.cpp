#include <BRepPrimAPI_MakeWedge.hxx>
#include <Precision.hxx>
#include <gp_Pnt.hxx>

#include "WedgeNode.hpp"

WedgeNode::WedgeNode()
    : m_useLtx(Standard_True), m_size(1, 1, 1), m_ltx(0.5), m_xmin(0.5), m_xmax(0.5), m_zmin(0.5), m_zmax(0.5)
{
}

void WedgeNode::setSize(gp_Pnt size)
{
  if (!size.IsEqual(m_size, Precision::Confusion()))
  {
    m_size = size;
    propsChanged();
  }
}

void WedgeNode::setLtx(Standard_Real ltx)
{
  if (!m_useLtx || !IsEqual(ltx, m_ltx))
  {
    m_useLtx = Standard_True;
    m_ltx = ltx;
    propsChanged();
  }
}

void WedgeNode::setMinMax(Standard_Real xmin, Standard_Real xmax, Standard_Real zmin, Standard_Real zmax)
{
  if (!IsEqual(xmin, m_xmin) || !IsEqual(xmax, m_xmax) || !IsEqual(zmin, m_zmin) || !IsEqual(zmax, m_zmax))
  {
    m_useLtx = Standard_False;
    m_xmin = xmin;
    m_xmax = xmax;
    m_zmin = zmin;
    m_zmax = zmax;
    propsChanged();
  }
}

bool WedgeNode::computeShape(const Message_ProgressRange &theRange)
{
  shape = TopoDS_Shape();

  BRepPrimAPI_MakeWedge makeWedge(1, 1, 1, 1);

  if (m_useLtx)
  {
    makeWedge = BRepPrimAPI_MakeWedge(m_size.X(), m_size.Y(), m_size.Z(), m_ltx);
  }
  else
  {
    makeWedge = BRepPrimAPI_MakeWedge(m_size.X(), m_size.Y(), m_size.Z(), m_xmin, m_zmin, m_xmax, m_zmax);
  }

  makeWedge.Build(/*theRange*/);
  if (!makeWedge.IsDone())
  {
    addError("Could not construct wedge");
    return false;
  }

  shape = makeWedge.Solid();
  return true;
}
