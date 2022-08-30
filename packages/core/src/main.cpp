#include <iostream>
#include <memory>
#include <string>
#include <type_traits>
#include <vector>

#include <Graphic3d_Camera.hxx>
#include <StlAPI.hxx>

#include "ReactCADNode.h"
#include "ReactCADView.h"

#include "Geometry.h"

#include "BoxNode.h"
#include "CylinderNode.h"
#include "SphereNode.h"
#include "TorusNode.h"

#include "DifferenceNode.h"
#include "IntersectionNode.h"
#include "UnionNode.h"

#include "HelixNode.h"
#include "PrismNode.h"
#include "RevolutionNode.h"

#include "RotationNode.h"
#include "ScaleNode.h"
#include "TranslationNode.h"

#include <BRepMesh_IncrementalMesh.hxx>
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
    return std::make_shared<BoxNode>();
  }
  if (type == "cylinder")
  {
    return std::make_shared<CylinderNode>();
  }
  if (type == "difference")
  {
    return std::make_shared<DifferenceNode>();
  }
  if (type == "helix")
  {
    return std::make_shared<HelixNode>();
  }
  if (type == "intersection")
  {
    return std::make_shared<IntersectionNode>();
  }
  if (type == "prism")
  {
    return std::make_shared<PrismNode>();
  }
  if (type == "revolution")
  {
    return std::make_shared<RevolutionNode>();
  }
  if (type == "rotation")
  {
    return std::make_shared<RotationNode>();
  }
  if (type == "scale")
  {
    return std::make_shared<ScaleNode>();
  }
  if (type == "sphere")
  {
    return std::make_shared<SphereNode>();
  }
  if (type == "torus")
  {
    return std::make_shared<TorusNode>();
  }
  if (type == "translation")
  {
    return std::make_shared<TranslationNode>();
  }
  if (type == "union")
  {
    return std::make_shared<UnionNode>();
  }

  return std::make_shared<BoxNode>();
}

void setNode(std::shared_ptr<ReactCADNode> node)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->setNode(node);
}

void removeNode()
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->removeNode();
}

void render()
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->render();
}

void setColor(std::string color)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->setColor(color);
}

void zoom(double delta)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->zoom(delta);
}

void resetView()
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->resetView();
}

void fit()
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->fit();
}

void setViewpoint(ReactCADView::Viewpoint viewpoint)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->setViewpoint(viewpoint);
}

void setProjection(Graphic3d_Camera::Projection projection)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->setProjection(projection);
}

void showAxes(bool show)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->showAxes(show);
}

void showGrid(bool show)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->showGrid(show);
}

void showWireframe(bool show)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->showWireframe(show);
}

void showShaded(bool show)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->showShaded(show);
}

void onResize()
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->onResize();
}

Standard_Boolean writeSTL(const std::shared_ptr<ReactCADNode> &node, const std::string filename,
                          const Standard_Real theLinDeflection, const Standard_Boolean isRelative,
                          const Standard_Real theAngDeflection)
{
  node->renderTree();
  BRepMesh_IncrementalMesh mesh(node->shape, theLinDeflection, isRelative, theAngDeflection);
  return StlAPI::Write(node->shape, filename.c_str());
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

extern "C" void shutdown()
{
  ReactCADView::destroyView();
  emscripten_force_exit(0);
}

namespace emscripten
{
namespace internal
{

template <typename T, typename Allocator> struct BindingType<std::vector<T, Allocator>>
{
  using ValBinding = BindingType<val>;
  using WireType = ValBinding::WireType;

  static std::vector<T, Allocator> fromWireType(WireType value)
  {
    return vecFromJSArray<T>(ValBinding::fromWireType(value));
  }
};

template <typename T>
struct TypeID<
    T, typename std::enable_if_t<std::is_same<typename Canonicalized<T>::type,
                                              std::vector<typename Canonicalized<T>::type::value_type,
                                                          typename Canonicalized<T>::type::allocator_type>>::value>>
{
  static constexpr TYPEID get()
  {
    return TypeID<val>::get();
  }
};

} // namespace internal
} // namespace emscripten

EMSCRIPTEN_BINDINGS(react_cad)
{
  // Base node
  emscripten::class_<ReactCADNode>("ReactCADNode")
      .smart_ptr<std::shared_ptr<ReactCADNode>>("ReactCADNode")
      .function("appendChild", &ReactCADNode::appendChild)
      .function("insertChildBefore", &ReactCADNode::insertChildBefore)
      .function("removeChild", &ReactCADNode::removeChild)
      .function("hasParent", &ReactCADNode::hasParent)
      .function("render", &ReactCADNode::renderTree);

  emscripten::value_array<Point>("Point").element(&Point::x).element(&Point::y).element(&Point::z);

  // Primitives
  emscripten::value_object<BoxProps>("BoxProps")
      .field("center", &BoxProps::center)
      .field("x", &BoxProps::x)
      .field("y", &BoxProps::y)
      .field("z", &BoxProps::z);
  emscripten::class_<BoxNode, emscripten::base<ReactCADNode>>("ReactCADBoxNode")
      .smart_ptr<std::shared_ptr<BoxNode>>("ReactCADBoxNode")
      .function("setProps", &BoxNode::setProps);

  emscripten::value_object<CylinderProps>("CylinderProps")
      .field("center", &CylinderProps::center)
      .field("radius", &CylinderProps::radius)
      .field("height", &CylinderProps::height);
  emscripten::class_<CylinderNode, emscripten::base<ReactCADNode>>("ReactCADCylinderNode")
      .smart_ptr<std::shared_ptr<CylinderNode>>("ReactCADCylinderNode")
      .function("setProps", &CylinderNode::setProps);

  emscripten::value_object<TorusProps>("TorusProps")
      .field("radius1", &TorusProps::radius1)
      .field("radius2", &TorusProps::radius2);
  emscripten::class_<TorusNode, emscripten::base<ReactCADNode>>("ReactCADTorusNode")
      .smart_ptr<std::shared_ptr<TorusNode>>("ReactCADTorusNode")
      .function("setProps", &TorusNode::setProps);

  emscripten::value_object<SphereProps>("SphereProps").field("radius", &SphereProps::radius);
  emscripten::class_<SphereNode, emscripten::base<ReactCADNode>>("ReactCADSphereNode")
      .smart_ptr<std::shared_ptr<SphereNode>>("ReactCADSphereNode")
      .function("setProps", &SphereNode::setProps);

  // Sweeps
  emscripten::class_<SweepNode, emscripten::base<ReactCADNode>>("ReactCADSweepNode")
      .smart_ptr<std::shared_ptr<SweepNode>>("ReactCADSweepNode")
      .function("setProfile", &SweepNode::setProfile);

  emscripten::value_object<PrismProps>("PrismProps")
      .field("axis", &PrismProps::axis)
      .field("height", &PrismProps::height);
  emscripten::class_<PrismNode, emscripten::base<SweepNode>>("ReactCADPrismNode")
      .smart_ptr<std::shared_ptr<PrismNode>>("ReactCADPrismNode")
      .function("setProps", &PrismNode::setProps);

  emscripten::value_object<RevolutionProps>("RevolutionProps")
      .field("axis", &RevolutionProps::axis)
      .field("angle", &RevolutionProps::angle);
  emscripten::class_<RevolutionNode, emscripten::base<SweepNode>>("ReactCADRevolutionNode")
      .smart_ptr<std::shared_ptr<RevolutionNode>>("ReactCADRevolutionNode")
      .function("setProps", &RevolutionNode::setProps);

  emscripten::value_object<HelixProps>("HelixProps")
      .field("pitch", &HelixProps::pitch)
      .field("height", &HelixProps::height);
  emscripten::class_<HelixNode, emscripten::base<SweepNode>>("ReactCADHelixNode")
      .smart_ptr<std::shared_ptr<HelixNode>>("ReactCADHelixNode")
      .function("setProps", &HelixNode::setProps);

  // Transformations
  emscripten::value_object<TranslationProps>("TranslationProps")
      .field("x", &TranslationProps::x)
      .field("y", &TranslationProps::y)
      .field("z", &TranslationProps::z);
  emscripten::class_<TranslationNode, emscripten::base<ReactCADNode>>("ReactCADTranslationNode")
      .smart_ptr<std::shared_ptr<TranslationNode>>("ReactCADTranslationNode")
      .function("setProps", &TranslationNode::setProps);

  emscripten::value_object<RotationProps>("RotationProps")
      .field("axis", &RotationProps::axis)
      .field("angle", &RotationProps::angle);
  emscripten::class_<RotationNode, emscripten::base<ReactCADNode>>("ReactCADRotationNode")
      .smart_ptr<std::shared_ptr<RotationNode>>("ReactCADRotationNode")
      .function("setProps", &RotationNode::setProps);

  emscripten::value_object<ScaleProps>("ScaleProps").field("factor", &ScaleProps::factor);
  emscripten::class_<ScaleNode, emscripten::base<ReactCADNode>>("ReactCADScaleNode")
      .smart_ptr<std::shared_ptr<ScaleNode>>("ReactCADScaleNode")
      .function("setProps", &ScaleNode::setProps);

  emscripten::enum_<Graphic3d_Camera::Projection>("Projection")
      .value("ORTHOGRAPHIC", Graphic3d_Camera::Projection_Orthographic)
      .value("PERSPECTIVE", Graphic3d_Camera::Projection_Perspective);

  emscripten::enum_<ReactCADView::Viewpoint>("Viewpoint")
      .value("TOP", ReactCADView::Viewpoint::Top)
      .value("BOTTOM", ReactCADView::Viewpoint::Bottom)
      .value("LEFT", ReactCADView::Viewpoint::Left)
      .value("RIGHT", ReactCADView::Viewpoint::Right)
      .value("FRONT", ReactCADView::Viewpoint::Front)
      .value("BACK", ReactCADView::Viewpoint::Back);

  emscripten::function("createCADNode", &createCADNode);
  emscripten::function("setNode", &setNode);
  emscripten::function("removeNode", &removeNode);
  emscripten::function("render", &render);
  // emscripten::function("setColor", &setColor);
  emscripten::function("zoom", &zoom);
  emscripten::function("resetView", &resetView);
  emscripten::function("fit", &fit);
  emscripten::function("setViewpoint", &setViewpoint);
  emscripten::function("setProjection", &setProjection);
  emscripten::function("showAxes", &showAxes);
  emscripten::function("showGrid", &showGrid);
  emscripten::function("showWireframe", &showWireframe);
  emscripten::function("showShaded", &showShaded);
  emscripten::function("onResize", &onResize);
  emscripten::function("writeSTL", &writeSTL);
}
