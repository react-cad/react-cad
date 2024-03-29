#include "ObjImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWObj.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

ObjImportNode::ObjImportNode()
{
}

TopoDS_Shape ObjImportNode::importFile(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Triangulating obj");
#endif
  setShape(TopoDS_Shape());

  Message_ProgressScope scope(handler, "Importing obj file", 3);

  Handle(Poly_Triangulation) mesh = RWObj::ReadFile(m_filename.c_str(), scope.Next());

  if (mesh.IsNull())
  {
    handler.Abort("objimport: file missing, corrupt or contains no shapes");
    return TopoDS_Shape();
  }

#ifdef REACTCAD_DEBUG
  timer.end();

  PerformanceTimer timer2("Sewing obj mesh");
#endif

  if (scope.More())
  {
    TopoDS_Shape shape;
    bool success = shapeFromMesh(mesh, shape, handler.WithRange(scope.Next(2)));

#ifdef REACTCAD_DEBUG
    timer2.end();
#endif

    if (success)
    {
      return shape;
    }
    else
    {
      handler.Abort("objimport: mesh sewing failed");
    }
  }

  return TopoDS_Shape();
}
