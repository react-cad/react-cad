#include "ObjImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWObj.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

ObjImportNode::ObjImportNode()
{
}

void ObjImportNode::importFile(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Triangulating obj");
#endif
  Message_ProgressScope scope(theRange, "Importing obj file", 3);

  Handle(Poly_Triangulation) mesh = RWObj::ReadFile(m_filename.c_str(), scope.Next());

#ifdef REACTCAD_DEBUG
  timer.end();

  PerformanceTimer timer2("Sewing obj mesh");
#endif

  if (scope.More())
  {
    shape = shapeFromMesh(mesh, scope.Next(2));
  }

#ifdef REACTCAD_DEBUG
  timer2.end();
#endif
}
