#include "STLImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWStl.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

STLImportNode::STLImportNode()
{
}

void STLImportNode::importFile(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Triangulating STL");
#endif
  setShape(TopoDS_Shape());

  Message_ProgressScope scope(handler, "Importing STL file", 3);

  Handle(Poly_Triangulation) mesh = RWStl::ReadFile(m_filename.c_str(), scope.Next());
  if (mesh.IsNull())
  {
    handler.Abort("stlimport: file missing, corrupt or contains no shapes");
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif

  if (scope.More())
  {
#ifdef REACTCAD_DEBUG
    PerformanceTimer timer2("Sewing STL mesh");
#endif

    TopoDS_Shape shape;
    bool success = shapeFromMesh(mesh, shape, handler.WithRange(scope.Next(2)));
    if (success)
    {
      setShape(shape);
    }
    else
    {
      handler.Abort("stlimport: mesh sewing failed");
    }

#ifdef REACTCAD_DEBUG
    timer2.end();
#endif
  }
}
