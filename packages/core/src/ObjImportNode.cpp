#include "ObjImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWObj.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

ObjImportNode::ObjImportNode()
{
}

void ObjImportNode::importFile(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Triangulating obj");
#endif
  shape = TopoDS_Shape();

  Message_ProgressScope scope(handler, "Importing obj file", 3);

  Handle(Poly_Triangulation) mesh = RWObj::ReadFile(m_filename.c_str(), scope.Next());

  if (mesh.IsNull())
  {
    handler.Abort("objimport: file missing, corrupt or contains no shapes");
    return;
  }

#ifdef REACTCAD_DEBUG
  timer.end();

  PerformanceTimer timer2("Sewing obj mesh");
#endif

  if (scope.More())
  {
    bool success = shapeFromMesh(mesh, shape, handler.WithRange(scope.Next(2)));
    if (!success)
    {
      handler.Abort("objimport: mesh sewing failed");
    }
  }

#ifdef REACTCAD_DEBUG
  timer2.end();
#endif
}
