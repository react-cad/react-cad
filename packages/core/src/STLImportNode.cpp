#include "STLImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWStl.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

STLImportNode::STLImportNode()
{
}

void STLImportNode::importFile(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Triangulating STL");
#endif

  Message_ProgressScope scope(theRange, "Importing STL file", 3);

  Handle(Poly_Triangulation) mesh = RWStl::ReadFile(m_filename.c_str(), scope.Next());

#ifdef REACTCAD_DEBUG
  timer.end();
#endif

  if (scope.More())
  {
#ifdef REACTCAD_DEBUG
    PerformanceTimer timer2("Sewing STL mesh");
#endif

    shape = shapeFromMesh(mesh, scope.Next(2));

#ifdef REACTCAD_DEBUG
    timer2.end();
#endif
  }
}
