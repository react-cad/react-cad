#include "STLImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWStl.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

STLImportNode::STLImportNode()
{
}

bool STLImportNode::importFile(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Triangulating STL");
#endif
  shape = TopoDS_Shape();

  Message_ProgressScope scope(theRange, "Importing STL file", 3);

  Handle(Poly_Triangulation) mesh = RWStl::ReadFile(m_filename.c_str(), scope.Next());
  if (mesh.IsNull())
  {
    addError("File missing, corrupt or contains no shapes");
    return false;
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif

  if (scope.More())
  {
#ifdef REACTCAD_DEBUG
    PerformanceTimer timer2("Sewing STL mesh");
#endif

    bool success = shapeFromMesh(mesh, shape, scope.Next(2));
    if (!success)
    {
      addError("Could not build topology from mesh");
      return false;
    }

#ifdef REACTCAD_DEBUG
    timer2.end();
#endif
  }

  return true;
}
