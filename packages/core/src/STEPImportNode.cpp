#include "STEPImportNode.hpp"

#include <Message.hxx>
#include <STEPControl_Reader.hxx>

#include <string>

#include "PerformanceTimer.hpp"

STEPImportNode::STEPImportNode()
{
}

TopoDS_Shape STEPImportNode::importFile(const ProgressHandler &handler)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Import STEP");
#endif
  setShape(TopoDS_Shape());

  Message_ProgressScope scope(handler, "Importing STEP file", 1);

  STEPControl_Reader reader;
  IFSelect_ReturnStatus status = reader.ReadFile(m_filename.c_str());

  if (status != IFSelect_RetDone)
  {
    std::stringstream errors;
    errors << "Error loading STEP file:\n";
    reader.PrintCheckLoad(errors, true, IFSelect_ItemsByEntity);
    handler.Abort("stepimport: import failed\n\n" + errors.str());
    return TopoDS_Shape();
  }

  Standard_Integer num = reader.TransferRoots(scope.Next());

  if (num == 0)
  {
    std::stringstream errors;
    errors << "Error transferring STEP entities:\n";
    reader.PrintCheckTransfer(errors, true, IFSelect_ItemsByEntity);
    handler.Abort("stepimport: import failed\n\n" + errors.str());
    return TopoDS_Shape();
  }

#ifdef REACTCAD_DEBUG
  timer.end();
#endif

  return reader.OneShape();
}
