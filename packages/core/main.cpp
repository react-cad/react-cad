#include <iostream>

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
#include <TopoDS_Shape.hxx>
#include <Standard_ArrayStreamBuffer.hxx>

#include <emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/bind.h>

//! Global viewer instance.
static WasmOcctView aViewer;
static Handle(AIS_Shape) aShapePrs;

TopoDS_Shape makeBox(double x, double y, double z) {
  BRepPrimAPI_MakeBox aBox(x, y, z);
  return aBox.Solid(); 
}

void clearShape() {
  AIS_ListOfInteractive aShapes;
  aViewer.Context()->DisplayedObjects (AIS_KOI_Shape, -1, aShapes);
  for (AIS_ListOfInteractive::Iterator aShapeIter (aShapes); aShapeIter.More(); aShapeIter.Next())
  {
    aViewer.Context()->Remove (aShapeIter.Value(), false);
  }
}

void setShape(TopoDS_Shape& aShape) {
  clearShape();

  aShapePrs->SetShape(aShape);
  aShapePrs->SetMaterial (Graphic3d_NameOfMaterial_Silver);
  aViewer.Context()->Display (aShapePrs, AIS_Shaded, 0, false);
  aViewer.View()->FitAll (0.01, false);
  aViewer.View()->Redraw();
  Message::DefaultMessenger()->Send (TCollection_AsciiString("Set shape"), Message_Info);
  Message::DefaultMessenger()->Send (OSD_MemInfo::PrintInfo(), Message_Trace);
}

using namespace emscripten;

EMSCRIPTEN_BINDINGS(react_cad) {
  function("makeBox", &makeBox);
  function("setShape", &setShape);
  function("clearShape", &clearShape);
  class_<TopoDS_Shape>("Shape");
}


//! Dummy main loop callback for a single shot.
extern "C" void onMainLoop()
{
  // do nothing here - viewer updates are handled on demand
  emscripten_cancel_main_loop();
}


int main()
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

  // load some file
  // emscripten_async_wget_data ("samples/Ball.brep", (void* )"samples/Ball.brep", onFileDataRead, onFileReadFailed);
  return 0;
}
