#include "STEPImportNode.hpp"

#include <Message.hxx>
#include <STEPControl_Reader.hxx>

#include <string>

STEPImportNode::STEPImportNode()
{
}

STEPImportNode::~STEPImportNode()
{
}

void STEPImportNode::parseSrc(std::string &src)
{
  std::stringstream stream(src);

  STEPControl_Reader reader;
  IFSelect_ReturnStatus status = reader.ReadStream("imported.stp", stream);

  if (status != IFSelect_RetDone)
  {
    std::stringstream errors;
    errors << "Error loading STEP file:\n";
    reader.PrintCheckLoad(errors, true, IFSelect_ItemsByEntity);
    Message::DefaultMessenger()->Send(errors);

    shape = TopoDS_Shape();
    return;
  }

  Standard_Integer num = reader.TransferRoots();

  std::stringstream message;
  message << "STEP entities imported: " << num;
  Message::DefaultMessenger()->Send(message);

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
}
