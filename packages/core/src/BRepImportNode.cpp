#include "BRepImportNode.hpp"

#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <Message_ProgressScope.hxx>
#include <TopoDS_Shape.hxx>

#include <string>

#include "PerformanceTimer.hpp"

BRepImportNode::BRepImportNode()
{
}

TopoDS_Shape BRepImportNode::importFile(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Import BRep");
#endif
  setShape(TopoDS_Shape());

  Message_ProgressScope scope(handler, "Importing BREP file", 1);

  TopoDS_Shape brep;
  BRep_Builder builder;
  Standard_Boolean success = BRepTools::Read(brep, m_filename.c_str(), builder, scope.Next());

#ifdef REACTCAD_DEBUG
  timer.end();
#endif

  if (success)
  {
    return brep;
  }
  else
  {
    handler.Abort("brepimport: file is missing, corrupt or contains no shapes");
  }

  return TopoDS_Shape();
}
