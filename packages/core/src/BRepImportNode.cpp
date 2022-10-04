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

void BRepImportNode::importFile(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Import BRep");
#endif

  Message_ProgressScope scope(theRange, "Importing BREP file", 1);

  TopoDS_Shape brep;
  BRep_Builder builder;
  Standard_Boolean success = BRepTools::Read(brep, m_filename.c_str(), builder, scope.Next());

  if (success)
  {
    shape = brep;
  }
  else
  {
    shape = TopoDS_Shape();
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
