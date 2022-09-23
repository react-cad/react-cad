#include "BRepImportNode.hpp"

#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <TopoDS_Shape.hxx>

#include <string>

#include "PerformanceTimer.hpp"

BRepImportNode::BRepImportNode()
{
}

void BRepImportNode::importFile()
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Import BRep");
#endif

  TopoDS_Shape brep;
  BRep_Builder builder;
  Standard_Boolean success = BRepTools::Read(brep, m_filename.c_str(), builder);

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
