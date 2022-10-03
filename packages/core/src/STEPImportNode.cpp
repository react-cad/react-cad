#include "STEPImportNode.hpp"

#include <Message.hxx>
#include <STEPControl_Reader.hxx>

#include <string>

#include "PerformanceTimer.hpp"

STEPImportNode::STEPImportNode()
{
}

void STEPImportNode::importFile(const Message_ProgressRange &theRange)
{
#ifdef REACTCAD_DEBUG
  PerformanceTimer timer("Import STEP");
#endif

  Message_ProgressScope scope(theRange, "Importing STEP file", 1);

  STEPControl_Reader reader;
  IFSelect_ReturnStatus status = reader.ReadFile(m_filename.c_str());

  if (status != IFSelect_RetDone)
  {
    std::stringstream errors;
    errors << "Error loading STEP file:\n";
    reader.PrintCheckLoad(errors, true, IFSelect_ItemsByEntity);
    Message::DefaultMessenger()->Send(errors);

    shape = TopoDS_Shape();
    return;
  }

  Standard_Integer num = reader.TransferRoots(scope.Next());

  if (num == 0)
  {
    std::stringstream errors;
    errors << "Error transferring STEP entities:\n";
    reader.PrintCheckTransfer(errors, true, IFSelect_ItemsByEntity);
    Message::DefaultMessenger()->Send(errors);

    shape = TopoDS_Shape();
    return;
  }

  shape = reader.OneShape();

#ifdef REACTCAD_DEBUG
  timer.end();
#endif
}
