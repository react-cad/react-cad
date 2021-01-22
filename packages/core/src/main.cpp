#include <iostream>
#include <memory>
#include <string>
#include <vector>

#include "ReactCADNode.h"
#include "ReactCADView.h"

#include "BoxFactory.h"
#include "CylinderFactory.h"
#include "DifferenceFactory.h"
#include "IntersectionFactory.h"
#include "RotationFactory.h"
#include "SphereFactory.h"
#include "TorusFactory.h"
#include "TranslationFactory.h"
#include "UnionFactory.h"

#include <Message.hxx>
#include <Message_Messenger.hxx>
#include <Message_PrinterSystemLog.hxx>
#include <OSD_MemInfo.hxx>
#include <OSD_Parallel.hxx>

#include <AIS_Shape.hxx>
#include <BRepAlgoAPI_BuilderAlgo.hxx>
#include <BRepAlgoAPI_Common.hxx>
#include <BRepAlgoAPI_Cut.hxx>
#include <BRepBuilderAPI_Copy.hxx>
#include <BRepBuilderAPI_Transform.hxx>
#include <BRepPrimAPI_MakeBox.hxx>
#include <BRepPrimAPI_MakeCylinder.hxx>
#include <BRepPrimAPI_MakeSphere.hxx>
#include <BRepPrimAPI_MakeTorus.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <Standard_ArrayStreamBuffer.hxx>
#include <TopTools_ListOfShape.hxx>
#include <TopoDS_Shape.hxx>

#include <gp.hxx>
#include <gp_Trsf.hxx>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5.h>

std::shared_ptr<ReactCADNode> createCADNode(std::string type)
{
  if (type == "box")
  {
    return std::make_shared<ReactCADNode>(new BoxFactory());
  }
  if (type == "cylinder")
  {
    return std::make_shared<ReactCADNode>(new CylinderFactory());
  }
  if (type == "difference")
  {
    return std::make_shared<ReactCADNode>(new DifferenceFactory());
  }
  if (type == "intersection")
  {
    return std::make_shared<ReactCADNode>(new IntersectionFactory());
  }
  if (type == "rotation")
  {
    return std::make_shared<ReactCADNode>(new RotationFactory());
  }
  if (type == "sphere")
  {
    return std::make_shared<ReactCADNode>(new SphereFactory());
  }
  if (type == "torus")
  {
    return std::make_shared<ReactCADNode>(new TorusFactory());
  }
  if (type == "translation")
  {
    return std::make_shared<ReactCADNode>(new TranslationFactory());
  }
  if (type == "union")
  {
    return std::make_shared<ReactCADNode>(new UnionFactory());
  }

  return std::make_shared<ReactCADNode>(new BoxFactory());
}

TopoDS_Shape makeSphere(double radius)
{
  BRepPrimAPI_MakeSphere aSphere(radius);
  return aSphere.Solid();
}

TopoDS_Shape makeTorus(double radius1, double radius2)
{
  BRepPrimAPI_MakeTorus aTorus(radius1, radius2);
  return aTorus.Solid();
}

gp_Trsf makeRotation(const gp_Ax1 &anAxis, Standard_Real angle)
{
  gp_Trsf trsf;
  trsf.SetRotation(anAxis, angle);
  return trsf;
}

gp_Trsf makeTranslation(Standard_Real x, Standard_Real y, Standard_Real z)
{
  gp_Trsf trsf;
  trsf.SetTranslation(gp::Origin(), gp_Pnt(x, y, z));
  return trsf;
}

gp_Trsf makeScale(Standard_Real factor)
{
  gp_Trsf trsf;
  trsf.SetScale(gp::Origin(), factor);
  return trsf;
}

TopoDS_Shape applyTransform(const TopoDS_Shape &aShape, const gp_Trsf &trsf)
{
  if (aShape.IsNull())
  {
    return aShape;
  }
  BRepBuilderAPI_Transform theTransform(trsf);
  theTransform.Perform(aShape, true);
  return theTransform.Shape();
}

TopoDS_Shape makeUnion(std::vector<TopoDS_Shape> shapes)
{
  BRepAlgoAPI_BuilderAlgo aBuilder;

  TopTools_ListOfShape aLS;
  for (TopoDS_Shape shape : shapes)
  {
    aLS.Append(shape);
  }

  aBuilder.SetArguments(aLS);

  aBuilder.Build();
  if (aBuilder.HasErrors())
  {
    aBuilder.DumpErrors(Message::DefaultMessenger()->SendFail());
    TopoDS_Shape nullShape;
    return nullShape;
  }
  return aBuilder.Shape();
}

TopoDS_Shape makeDifference(std::vector<TopoDS_Shape> shapes)
{
  BRepAlgoAPI_Cut aBuilder;

  TopTools_ListOfShape aLS;
  TopTools_ListOfShape aLT;

  for (TopoDS_Shape shape : shapes)
  {
    if (shape == shapes.front())
    {
      aLS.Append(shape);
    }
    else
    {
      aLT.Append(shape);
    }
  }

  aBuilder.SetArguments(aLS);
  aBuilder.SetTools(aLT);

  aBuilder.Build();
  if (aBuilder.HasErrors())
  {
    aBuilder.DumpErrors(Message::DefaultMessenger()->SendFail());
    TopoDS_Shape nullShape;
    return nullShape;
  }
  return aBuilder.Shape();
}

TopoDS_Shape makeIntersection(std::vector<TopoDS_Shape> shapes)
{
  TopTools_ListOfShape aLS;
  TopTools_ListOfShape aLT;

  for (int i = 0; i < shapes.size(); i++)
  {
    if (i == 0)
    {
      aLS.Append(shapes.at(i));
    }
    else
    {
      aLT.Append(shapes.at(i));

      BRepAlgoAPI_Common aBuilder;
      aBuilder.SetArguments(aLS);
      aBuilder.SetTools(aLT);

      aBuilder.Build();

      if (aBuilder.HasErrors())
      {
        aBuilder.DumpErrors(Message::DefaultMessenger()->SendFail());
        TopoDS_Shape nullShape;
        return nullShape;
      }

      aLS.Clear();
      aLS.Append(aBuilder.Shape());
      aLT.Clear();
    }
  }

  return aLS.First();
}

//! Dummy main loop callback for a single shot.
extern "C" void onMainLoop()
{
  // do nothing here - viewer updates are handled on demand
  emscripten_cancel_main_loop();
}

int main()
{
  Message::DefaultMessenger()->Printers().First()->SetTraceLevel(Message_Trace);
  Handle(Message_PrinterSystemLog) aJSConsolePrinter = new Message_PrinterSystemLog("webgl-sample", Message_Trace);
  Message::DefaultMessenger()->AddPrinter(
      aJSConsolePrinter); // open JavaScript console within the Browser to see this output
  Message::DefaultMessenger()->Send(
      TCollection_AsciiString("NbLogicalProcessors: ") + OSD_Parallel::NbLogicalProcessors(), Message_Trace);

  // setup a dummy single-shot main loop callback just to shut up a useless Emscripten error message on calling
  // eglSwapInterval()
  emscripten_set_main_loop(onMainLoop, -1, 0);

  Message::DefaultMessenger()->Send(OSD_MemInfo::PrintInfo(), Message_Trace);

  return 0;
}

using namespace emscripten;

EMSCRIPTEN_BINDINGS(react_cad)
{
  emscripten::class_<ReactCADNode>("ReactCADNode")
      .smart_ptr<std::shared_ptr<ReactCADNode>>("ReactCADNode")
      .function("setProps", &ReactCADNode::setProps)
      .function("appendChild", &ReactCADNode::appendChild)
      .function("insertChildBefore", &ReactCADNode::insertChildBefore)
      .function("removeChild", &ReactCADNode::removeChild)
      .function("hasParent", &ReactCADNode::hasParent)
      .function("render", &ReactCADNode::render)
      .property("shape", &ReactCADNode::shape);

  emscripten::class_<ReactCADView>("ReactCADView")
      .smart_ptr<std::shared_ptr<ReactCADView>>("ReactCADView")
      .function("addNode", &ReactCADView::addNode)
      .function("removeNode", &ReactCADView::removeNode)
      .function("renderNodes", &ReactCADView::renderNodes)
      .function("fit", &ReactCADView::fit);

  function("createCADNode", &createCADNode);
  function("getView", &ReactCADView::getView);

  class_<gp>("Space")
      .class_function("Origin", &gp::Origin)
      .class_function("OX", &gp::OX)
      .class_function("OY", &gp::OY)
      .class_function("OZ", &gp::OZ);

  class_<gp_Pnt>("Point");
  class_<gp_Ax1>("Axis");
  class_<gp_Trsf>("Transform");
  function("makeSphere", &makeSphere);
  function("makeTorus", &makeTorus);
  function("makeRotation", &makeRotation);
  function("makeTranslation", &makeTranslation);
  function("makeScale", &makeScale);
  function("applyTransform", &applyTransform);
  function("makeUnion", &makeUnion);
  function("makeDifference", &makeDifference);
  function("makeIntersection", &makeIntersection);
}
