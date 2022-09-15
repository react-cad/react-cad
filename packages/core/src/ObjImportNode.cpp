#include "ObjImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWObj.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

ObjImportNode::ObjImportNode()
{
}

ObjImportNode::~ObjImportNode()
{
}

void ObjImportNode::importFile()
{
  PerformanceTimer timer("Triangulating obj");
  Handle(Poly_Triangulation) mesh = RWObj::ReadFile(m_filename.c_str());
  timer.end();

  PerformanceTimer timer2("Sewing obj mesh");
  shape = shapeFromMesh(mesh);
  timer2.end();
}
