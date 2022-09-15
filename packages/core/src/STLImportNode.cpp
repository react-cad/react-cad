#include "STLImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWStl.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

STLImportNode::STLImportNode()
{
}

STLImportNode::~STLImportNode()
{
}

void STLImportNode::importFile()
{
  PerformanceTimer timer("Triangulating STL");
  Handle(Poly_Triangulation) mesh = RWStl::ReadFile(m_filename.c_str());
  timer.end();

  PerformanceTimer timer2("Sewing STL mesh");
  shape = shapeFromMesh(mesh);
  timer2.end();
}
