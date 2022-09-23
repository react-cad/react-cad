#include "STLImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWStl.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

STLImportNode::STLImportNode()
{
}

void STLImportNode::importFile()
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Triangulating STL");
#endif

  Handle(Poly_Triangulation) mesh = RWStl::ReadFile(m_filename.c_str());

#ifdef REACTCAD_DEBUG
  timer.end();

  PerformanceTimer timer2("Sewing STL mesh");
#endif

  shape = shapeFromMesh(mesh);

#ifdef REACTCAD_DEBUG
  timer2.end();
#endif
}
