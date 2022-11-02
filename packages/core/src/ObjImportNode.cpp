#include "ObjImportNode.hpp"

#include <Poly_Triangulation.hxx>
#include <RWObj.hxx>

#include <string>

#include "PerformanceTimer.hpp"
#include "meshtools.hpp"

ObjImportNode::ObjImportNode()
{
}

bool ObjImportNode::importFile(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Triangulating obj");
#endif
  shape = TopoDS_Shape();

  Message_ProgressScope scope(theRange, "Importing obj file", 3);

  Handle(Poly_Triangulation) mesh = RWObj::ReadFile(m_filename.c_str(), scope.Next());

  if (mesh.IsNull())
  {
    addError("File missing, corrupt or contains no shapes");
    return false;
  }

#ifdef REACTCAD_DEBUG
  timer.end();

  PerformanceTimer timer2("Sewing obj mesh");
#endif

  if (scope.More())
  {
    bool success = shapeFromMesh(mesh, shape, scope.Next(2));
    if (!success)
    {
      addError("Could not build topology from mesh");
      return false;
    }
  }

#ifdef REACTCAD_DEBUG
  timer2.end();
#endif

  return true;
}
