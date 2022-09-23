#include "ObjImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWObj.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

ObjImportNode::ObjImportNode()
{
}

void ObjImportNode::importFile()
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Triangulating obj");
#endif

  Handle(Poly_Triangulation) mesh = RWObj::ReadFile(m_filename.c_str());

#ifdef REACTCAD_DEBUG
  timer.end();

  PerformanceTimer timer2("Sewing obj mesh");
#endif

  shape = shapeFromMesh(mesh);

#ifdef REACTCAD_DEBUG
  timer2.end();
#endif
}
