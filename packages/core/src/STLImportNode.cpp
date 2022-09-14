#include "STLImportNode.hpp"

#include <BRepBuilderAPI_MakeSolid.hxx>
#include <BRepLib.hxx>
#include <BRepTools.hxx>
#include <Message.hxx>
#include <StlAPI_Reader.hxx>
#include <TopoDS.hxx>
#include <TopoDS_Shell.hxx>
#include <TopoDS_Solid.hxx>

#include <string>

#include "PerformanceTimer.hpp"

STLImportNode::STLImportNode()
{
}

STLImportNode::~STLImportNode()
{
}

void STLImportNode::importFile()
{
  TopoDS_Shape stl;
  StlAPI_Reader reader;
  PerformanceTimer timer("Triangulating STL");
  reader.Read(stl, m_filename.c_str());
  timer.end();

  if (stl.ShapeType() == TopAbs_SHELL)
  {
    PerformanceTimer timer("Sewing STL mesh");
    TopoDS_Shell shell = TopoDS::Shell(stl);
    BRepBuilderAPI_MakeSolid makeSolid;
    makeSolid.Add(shell);
    makeSolid.Build();
    TopoDS_Solid solid = makeSolid.Solid();
    BRepLib::OrientClosedSolid(solid);

    shape = solid;
    timer.end();
  }
  else
  {
    Message::DefaultMessenger()->Send("STL failed");
    shape = TopoDS_Solid();
  }
}
