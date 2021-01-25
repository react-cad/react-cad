#include <iostream>
#include <memory>
#include <string>
#include <vector>

#include "ReactCADNode.h"
#include "ReactCADView.h"

#include "BoxFactory.h"
#include "CylinderFactory.h"
#include "DifferenceFactory.h"
#include "HelixFactory.h"
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

#include <Standard_ArrayStreamBuffer.hxx>

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
  if (type == "helix")
  {
    return std::make_shared<ReactCADNode>(new HelixFactory());
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

//! Dummy main loop callback for a single shot.
extern "C" void onMainLoop()
{
  // do nothing here - viewer updates are handled on demand
  emscripten_cancel_main_loop();
}

int main()
{
#ifdef REACTCAD_DEBUG
  Message::DefaultMessenger()->Printers().First()->SetTraceLevel(Message_Trace);
  Handle(Message_PrinterSystemLog) aJSConsolePrinter = new Message_PrinterSystemLog("webgl-sample", Message_Trace);
  Message::DefaultMessenger()->AddPrinter(
      aJSConsolePrinter); // open JavaScript console within the Browser to see this output
  Message::DefaultMessenger()->Send(
      TCollection_AsciiString("NbLogicalProcessors: ") + OSD_Parallel::NbLogicalProcessors(), Message_Trace);
  Message::DefaultMessenger()->Send(OSD_MemInfo::PrintInfo(), Message_Trace);
#endif

  // setup a dummy single-shot main loop callback just to shut up a useless Emscripten error message on calling
  // eglSwapInterval()
  emscripten_set_main_loop(onMainLoop, -1, 0);

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
      .function("render", &ReactCADNode::render);

  emscripten::class_<ReactCADView>("ReactCADView")
      .smart_ptr<std::shared_ptr<ReactCADView>>("ReactCADView")
      .function("addNode", &ReactCADView::addNode)
      .function("removeNode", &ReactCADView::removeNode)
      .function("renderNodes", &ReactCADView::renderNodes)
      .function("fit", &ReactCADView::fit);

  function("createCADNode", &createCADNode);
  function("getView", &ReactCADView::getView);
}
