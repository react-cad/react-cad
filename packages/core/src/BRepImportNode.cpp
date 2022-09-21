#include "BRepImportNode.hpp"

#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <TopoDS_Shape.hxx>

#include <string>

#include "PerformanceTimer.hpp"

BRepImportNode::BRepImportNode()
{
}

BRepImportNode::~BRepImportNode()
{
}

void BRepImportNode::importFile()
{
  PerformanceTimer timer("Import BRep");

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

  timer.end();
}
