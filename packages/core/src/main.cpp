#include <iostream>
#include <vector>

#include "WasmOcctView.h"

#include <Message.hxx>
#include <Message_Messenger.hxx>
#include <Message_PrinterSystemLog.hxx>
#include <OSD_MemInfo.hxx>
#include <OSD_Parallel.hxx>

#include <AIS_Shape.hxx>
#include <BRepTools.hxx>
#include <BRep_Builder.hxx>
#include <BRepPrimAPI_MakeBox.hxx>
#include <BRepPrimAPI_MakeCylinder.hxx>
#include <BRepPrimAPI_MakeSphere.hxx>
#include <BRepPrimAPI_MakeTorus.hxx>
#include <BRepBuilderAPI_Transform.hxx>
#include <BRepBuilderAPI_Copy.hxx>
#include <BRepAlgoAPI_BuilderAlgo.hxx>
#include <BRepAlgoAPI_Cut.hxx>
#include <BRepAlgoAPI_Common.hxx>
#include <TopoDS_Shape.hxx>
#include <TopTools_ListOfShape.hxx>
#include <Standard_ArrayStreamBuffer.hxx>

#include <gp_Trsf.hxx>
#include <gp.hxx>

#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/bind.h>

//! Global viewer instance.
static WasmOcctView aViewer;
static Handle(AIS_Shape) aShapePrs;

void clearShape() {
  AIS_ListOfInteractive aShapes;
  aViewer.Context()->DisplayedObjects (AIS_KOI_Shape, -1, aShapes);
  for (AIS_ListOfInteractive::Iterator aShapeIter (aShapes); aShapeIter.More(); aShapeIter.Next())
  {
    aViewer.Context()->Remove (aShapeIter.Value(), false);
  }
  aViewer.View()->Redraw();
}

void setShape(TopoDS_Shape& aShape) {
  clearShape();

  aShapePrs->SetShape(aShape);
  aShapePrs->SetMaterial (Graphic3d_NameOfMaterial_Silver);
  aViewer.Context()->Display (aShapePrs, AIS_Shaded, 0, false);
  aViewer.View()->Redraw();
}

void fitShape() {
  aViewer.View()->FitAll (0.1, false);
  aViewer.View()->Redraw();
}

TopoDS_Shape copyShape(TopoDS_Shape& aShape) {
  return BRepBuilderAPI_Copy(aShape);
}

TopoDS_Shape makeBox(double x, double y, double z) {
  BRepPrimAPI_MakeBox aBox(x, y, z);
  return aBox.Solid(); 
}

TopoDS_Shape makeCylinder(double radius, double height) {
  BRepPrimAPI_MakeCylinder aCylinder(radius, height);
  return aCylinder.Solid(); 
}

TopoDS_Shape makeSphere(double radius) {
  BRepPrimAPI_MakeSphere aSphere(radius);
  return aSphere.Solid(); 
}

TopoDS_Shape makeTorus(double radius1, double radius2) {
  BRepPrimAPI_MakeTorus aTorus(radius1, radius2);
  return aTorus.Solid(); 
}

gp_Trsf makeRotation(const gp_Ax1& anAxis, Standard_Real angle) {
  gp_Trsf trsf;
  trsf.SetRotation(anAxis, angle);
  return trsf;
}

gp_Trsf makeTranslation(Standard_Real x, Standard_Real y, Standard_Real z) {
  gp_Trsf trsf;
  trsf.SetTranslation(gp::Origin(), gp_Pnt(x, y, z));
  return trsf;
}

gp_Trsf makeScale(Standard_Real factor) {
  gp_Trsf trsf;
  trsf.SetScale(gp::Origin(), factor);
  return trsf;
}

TopoDS_Shape applyTransform(const TopoDS_Shape& aShape, const gp_Trsf& trsf) {
  if (aShape.IsNull()) {
    return aShape;
  }
  BRepBuilderAPI_Transform theTransform(trsf);
  theTransform.Perform(aShape, true);
  return theTransform.Shape();
}

TopoDS_Shape makeUnion(std::vector<TopoDS_Shape> shapes) {
  BRepAlgoAPI_BuilderAlgo aBuilder;

  TopTools_ListOfShape aLS;
  for(TopoDS_Shape shape : shapes) {
    aLS.Append(shape);
  }

  aBuilder.SetArguments(aLS);

  aBuilder.Build(); 
  if (aBuilder.HasErrors()) {
    aBuilder.DumpErrors(Message::DefaultMessenger()->SendFail());
    TopoDS_Shape nullShape;
    return nullShape;
  }
  return aBuilder.Shape();
}

TopoDS_Shape makeDifference(std::vector<TopoDS_Shape> shapes) {
  BRepAlgoAPI_Cut aBuilder;

  TopTools_ListOfShape aLS;
  TopTools_ListOfShape aLT;

  for(TopoDS_Shape shape : shapes) {
    if (shape == shapes.front()) {
      aLS.Append(shape);
    } else {
      aLT.Append(shape);
    }
  }

  aBuilder.SetArguments(aLS);
  aBuilder.SetTools(aLT);

  aBuilder.Build();
  if (aBuilder.HasErrors()) {
    aBuilder.DumpErrors(Message::DefaultMessenger()->SendFail());
    TopoDS_Shape nullShape;
    return nullShape;
  }
  return aBuilder.Shape();
}

TopoDS_Shape makeIntersection(std::vector<TopoDS_Shape> shapes) {
  TopTools_ListOfShape aLS;
  TopTools_ListOfShape aLT;

  for (int i = 0; i < shapes.size(); i++) {
    if (i == 0) {
      aLS.Append(shapes.at(i));
    } else {
      aLT.Append(shapes.at(i));

      BRepAlgoAPI_Common aBuilder;
      aBuilder.SetArguments(aLS);
      aBuilder.SetTools(aLT);

      aBuilder.Build(); 

      if (aBuilder.HasErrors()) {
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


int init()
{
  Message::DefaultMessenger()->Printers().First()->SetTraceLevel (Message_Trace);
  Handle(Message_PrinterSystemLog) aJSConsolePrinter = new Message_PrinterSystemLog ("webgl-sample", Message_Trace);
  Message::DefaultMessenger()->AddPrinter (aJSConsolePrinter); // open JavaScript console within the Browser to see this output
  Message::DefaultMessenger()->Send (TCollection_AsciiString("NbLogicalProcessors: ") + OSD_Parallel::NbLogicalProcessors(), Message_Trace);

  // setup a dummy single-shot main loop callback just to shut up a useless Emscripten error message on calling eglSwapInterval()
  emscripten_set_main_loop (onMainLoop, -1, 0);

  aViewer.run();
  aShapePrs = new AIS_Shape(makeBox(1, 1, 1));
  Message::DefaultMessenger()->Send (OSD_MemInfo::PrintInfo(), Message_Trace);

  return 0;
}

void init2()
{
  exit(0);
}

using namespace emscripten;

EMSCRIPTEN_BINDINGS(react_cad) {
  function("init", &init);
  function("init2", &init2);
  class_<gp>("Space")
    .class_function("Origin", &gp::Origin)
    .class_function("OX", &gp::OX)
    .class_function("OY", &gp::OY)
    .class_function("OZ", &gp::OZ)
  ;
  class_<gp_Pnt>("Point");
  class_<gp_Ax1>("Axis");
  class_<TopoDS_Shape>("Shape")
    .constructor<>()
    .function("IsNull", &TopoDS_Shape::IsNull)
  ;
  register_vector<TopoDS_Shape>("VectorShape");
  class_<gp_Trsf>("Transform");
  function("setShape", &setShape);
  function("fitShape", &fitShape);
  function("clearShape", &clearShape);
  function("makeBox", &makeBox);
  function("makeCylinder", &makeCylinder);
  function("makeSphere", &makeSphere);
  function("makeTorus", &makeTorus);
  function("makeRotation", &makeRotation);
  function("makeTranslation", &makeTranslation);
  function("makeScale", &makeScale);
  function("applyTransform", &applyTransform);
  function("copyShape", &copyShape);
  function("makeUnion", &makeUnion);
  function("makeDifference", &makeDifference);
  function("makeIntersection", &makeIntersection);
}