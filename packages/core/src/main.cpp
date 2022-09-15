#include <forward_list>
#include <iostream>
#include <list>
#include <memory>
#include <string>
#include <type_traits>

#include "ReactCADNode.hpp"
#include "ReactCADView.hpp"

#include "Geometry.hpp"

#include "BoxNode.hpp"
#include "ConeNode.hpp"
#include "CylinderNode.hpp"
#include "PolyhedronNode.hpp"
#include "SphereNode.hpp"
#include "TorusNode.hpp"
#include "WedgeNode.hpp"

#include "DifferenceNode.hpp"
#include "IntersectionNode.hpp"
#include "UnionNode.hpp"

#include "HelixNode.hpp"
#include "PrismNode.hpp"
#include "RevolutionNode.hpp"
#include "SweepNode.hpp"

#include "BRepImportNode.hpp"
#include "ImportNode.hpp"
#include "ObjImportNode.hpp"
#include "STEPImportNode.hpp"
#include "STLImportNode.hpp"

#include "AffineNode.hpp"
#include "RotationNode.hpp"
#include "ScaleNode.hpp"
#include "TranslationNode.hpp"

#include <BRepMesh_IncrementalMesh.hxx>
#include <Graphic3d_Camera.hxx>
#include <Message.hxx>
#include <Message_Messenger.hxx>
#include <Message_PrinterSystemLog.hxx>
#include <OSD_MemInfo.hxx>
#include <OSD_Parallel.hxx>
#include <StlAPI.hxx>

#include <Standard_ArrayStreamBuffer.hxx>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5.h>

#include <pthread.h>

std::shared_ptr<ReactCADNode> createCADNode(std::string type)
{
  if (type == "box")
  {
    return std::make_shared<BoxNode>();
  }
  if (type == "wedge")
  {
    return std::make_shared<WedgeNode>();
  }
  if (type == "cone")
  {
    return std::make_shared<ConeNode>();
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
  if (type == "polyhedron")
  {
    return std::make_shared<PolyhedronNode>();
  }
  if (type == "prism")
  {
    return std::make_shared<PrismNode>();
  }
  if (type == "revolution")
  {
    return std::make_shared<RevolutionNode>();
  }
  if (type == "affine")
  {
    return std::make_shared<AffineNode>();
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
  if (type == "brep")
  {
    return std::make_shared<BRepImportNode>();
  }
  if (type == "step")
  {
    return std::make_shared<STEPImportNode>();
  }
  if (type == "obj")
  {
    return std::make_shared<ObjImportNode>();
  }
  if (type == "stl")
  {
    return std::make_shared<STLImportNode>();
  }

  return std::make_shared<BoxNode>();
}

struct RenderRequest
{
  std::shared_ptr<ReactCADNode> node;
  bool reset;
};

std::list<RenderRequest> renderQueue;

pthread_mutex_t render_mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t render_cond = PTHREAD_COND_INITIALIZER;

void *renderInternal(void *data)
{
  while (true)
  {
    pthread_mutex_lock(&render_mutex);
    pthread_cond_wait(&render_cond, &render_mutex);

    std::shared_ptr<ReactCADView> view = ReactCADView::getView();

    do
    {
      RenderRequest request = renderQueue.back();

      std::list<RenderRequest>::reverse_iterator it;
      for (it = renderQueue.rbegin(); it != renderQueue.rend(); ++it)
      {
        if (it->node != request.node)
        {
          break;
        }
        if (it->reset)
        {
          request.reset = true;
        }
      }
      renderQueue.clear();
      pthread_mutex_unlock(&render_mutex);

      bool changed = request.node->computeGeometry();
      if (changed)
      {
        view->render(request.node->shape, request.reset);
      }
      else if (request.reset)
      {
        view->resetView();
      }

      pthread_mutex_lock(&render_mutex);
      // Catch requests that came in during render
    } while (renderQueue.size());

    pthread_mutex_unlock(&render_mutex);
  }
  return NULL;
}

void render(std::shared_ptr<ReactCADNode> node, bool reset = false)
{
  pthread_mutex_lock(&render_mutex);
  renderQueue.push_back({node, reset});
  pthread_cond_signal(&render_cond);
  pthread_mutex_unlock(&render_mutex);
}

void resetView()
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->resetView();
}

void setQuality(double deviationCoefficent, double angle)
{
  std::shared_ptr<ReactCADView> view = ReactCADView::getView();
  view->setQuality(deviationCoefficent, angle);
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
  node->computeGeometry();
  BRepMesh_IncrementalMesh mesh(node->shape, theLinDeflection, isRelative, theAngDeflection);
  return StlAPI::Write(node->shape, filename.c_str());
}

//! Dummy main loop callback for a single shot.
extern "C" void onMainLoop()
{
  // do nothing here - viewer updates are handled on demand
}

int main()
{
#ifdef REACTCAD_DEBUG
  Message::DefaultMessenger()->Printers().First()->SetTraceLevel(Message_Trace);
  Handle(Message_PrinterSystemLog) aJSConsolePrinter = new Message_PrinterSystemLog("webgl-sample", Message_Trace);
  /*
  Message::DefaultMessenger()->AddPrinter(
      aJSConsolePrinter); // open JavaScript console within the Browser to see this output
      */
  Message::DefaultMessenger()->Send(
      TCollection_AsciiString("NbLogicalProcessors: ") + OSD_Parallel::NbLogicalProcessors(), Message_Trace);
  Message::DefaultMessenger()->Send(OSD_MemInfo::PrintInfo(), Message_Trace);
#endif

  ReactCADNode::initializeMutex();

  pthread_t thread;
  int data;
  int iret1 = pthread_create(&thread, NULL, renderInternal, &data);
  pthread_detach(thread);

  emscripten_set_main_loop(onMainLoop, 1, 0);

  return 0;
}

extern "C" void shutdown()
{
  ReactCADView::destroyView();
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
      .function("hasParent", &ReactCADNode::hasParent);

  emscripten::value_array<Point>("Point").element(&Point::x).element(&Point::y).element(&Point::z);
  emscripten::value_array<Quaternion>("Quaternion")
      .element(&Quaternion::x)
      .element(&Quaternion::y)
      .element(&Quaternion::z)
      .element(&Quaternion::w);
  emscripten::value_array<MatrixRow>("MatrixRow")
      .element(&MatrixRow::a1)
      .element(&MatrixRow::a2)
      .element(&MatrixRow::a3)
      .element(&MatrixRow::a4);
  emscripten::value_array<Matrix>("Matrix")
      .element(&Matrix::a1)
      .element(&Matrix::a2)
      .element(&Matrix::a3)
      .element(&Matrix::a4);

  // Primitives
  emscripten::value_object<BoxProps>("BoxProps")
      .field("center", &BoxProps::center)
      .field("x", &BoxProps::x)
      .field("y", &BoxProps::y)
      .field("z", &BoxProps::z);
  emscripten::class_<BoxNode, emscripten::base<ReactCADNode>>("ReactCADBoxNode")
      .smart_ptr<std::shared_ptr<BoxNode>>("ReactCADBoxNode")
      .function("setProps", &BoxNode::setProps);

  emscripten::value_object<WedgePropsLtx>("WedgePropsLtx")
      .field("x", &WedgePropsLtx::x)
      .field("y", &WedgePropsLtx::y)
      .field("z", &WedgePropsLtx::z)
      .field("ltx", &WedgePropsLtx::ltx);
  emscripten::value_object<WedgePropsMinMax>("WedgePropsMinMax")
      .field("x", &WedgePropsMinMax::x)
      .field("y", &WedgePropsMinMax::y)
      .field("z", &WedgePropsMinMax::z)
      .field("xmin", &WedgePropsMinMax::xmin)
      .field("xmax", &WedgePropsMinMax::xmax)
      .field("zmin", &WedgePropsMinMax::zmin)
      .field("zmax", &WedgePropsMinMax::zmax);
  emscripten::class_<WedgeNode, emscripten::base<ReactCADNode>>("ReactCADWedgeNode")
      .smart_ptr<std::shared_ptr<WedgeNode>>("ReactCADWedgeNode")
      .function("setPropsLtx", &WedgeNode::setPropsLtx)
      .function("setPropsMinMax", &WedgeNode::setPropsMinMax);

  emscripten::value_object<ConeProps>("ConeProps")
      .field("center", &ConeProps::center)
      .field("radius1", &ConeProps::radius1)
      .field("radius2", &ConeProps::radius2)
      .field("height", &ConeProps::height)
      .field("angle", &ConeProps::angle);
  emscripten::class_<ConeNode, emscripten::base<ReactCADNode>>("ReactCADConeNode")
      .smart_ptr<std::shared_ptr<ConeNode>>("ReactCADConeNode")
      .function("setProps", &ConeNode::setProps);

  emscripten::value_object<CylinderProps>("CylinderProps")
      .field("center", &CylinderProps::center)
      .field("radius", &CylinderProps::radius)
      .field("height", &CylinderProps::height)
      .field("angle", &CylinderProps::angle);
  emscripten::class_<CylinderNode, emscripten::base<ReactCADNode>>("ReactCADCylinderNode")
      .smart_ptr<std::shared_ptr<CylinderNode>>("ReactCADCylinderNode")
      .function("setProps", &CylinderNode::setProps);

  emscripten::value_object<TorusProps>("TorusProps")
      .field("radius1", &TorusProps::radius1)
      .field("radius2", &TorusProps::radius2)
      .field("angle", &TorusProps::angle);
  emscripten::class_<TorusNode, emscripten::base<ReactCADNode>>("ReactCADTorusNode")
      .smart_ptr<std::shared_ptr<TorusNode>>("ReactCADTorusNode")
      .function("setProps", &TorusNode::setProps);

  emscripten::value_object<SphereProps>("SphereProps")
      .field("radius", &SphereProps::radius)
      .field("angle", &SphereProps::angle)
      .field("segmentAngle1", &SphereProps::segmentAngle1)
      .field("segmentAngle2", &SphereProps::segmentAngle2);
  emscripten::class_<SphereNode, emscripten::base<ReactCADNode>>("ReactCADSphereNode")
      .smart_ptr<std::shared_ptr<SphereNode>>("ReactCADSphereNode")
      .function("setProps", &SphereNode::setProps);

  emscripten::class_<PolyhedronNode, emscripten::base<ReactCADNode>>("ReactCADPolyhedronNode")
      .smart_ptr<std::shared_ptr<PolyhedronNode>>("ReactCADPolyhedronNode")
      .function("setPointsAndFaces", &PolyhedronNode::setPointsAndFaces);

  // Sweeps
  emscripten::class_<SweepNode, emscripten::base<ReactCADNode>>("ReactCADSweepNode")
      .smart_ptr<std::shared_ptr<SweepNode>>("ReactCADSweepNode")
      .function("setProfile", &SweepNode::setProfile)
      .function("setSVGProfile", &SweepNode::setSVGProfile);

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

  // Imports
  emscripten::class_<ImportNode, emscripten::base<ReactCADNode>>("ReactCADImportNode")
      .smart_ptr<std::shared_ptr<ImportNode>>("ReactCADImportNode")
      .function("setFilename", &ImportNode::setFilename)
      .function("getFilename", &ImportNode::getFilename);

  emscripten::class_<BRepImportNode, emscripten::base<ImportNode>>("ReactCADBRepImportNode")
      .smart_ptr<std::shared_ptr<BRepImportNode>>("ReactCADBRepImportNode");

  emscripten::class_<STEPImportNode, emscripten::base<ImportNode>>("ReactCADSTEPImportNode")
      .smart_ptr<std::shared_ptr<STEPImportNode>>("ReactCADSTEPImportNode");

  emscripten::class_<STLImportNode, emscripten::base<ImportNode>>("ReactCADSTLImportNode")
      .smart_ptr<std::shared_ptr<STLImportNode>>("ReactCADSTLImportNode");

  emscripten::class_<ObjImportNode, emscripten::base<ImportNode>>("ReactCADObjImportNode")
      .smart_ptr<std::shared_ptr<ObjImportNode>>("ReactCADObjImportNode");

  // Transformations
  emscripten::value_object<TranslationProps>("TranslationProps")
      .field("x", &TranslationProps::x)
      .field("y", &TranslationProps::y)
      .field("z", &TranslationProps::z);
  emscripten::class_<TranslationNode, emscripten::base<ReactCADNode>>("ReactCADTranslationNode")
      .smart_ptr<std::shared_ptr<TranslationNode>>("ReactCADTranslationNode")
      .function("setProps", &TranslationNode::setProps);

  emscripten::class_<AffineNode, emscripten::base<ReactCADNode>>("ReactCADAffineNode")
      .smart_ptr<std::shared_ptr<AffineNode>>("ReactCADAffineNode")
      .function("setMatrix", &AffineNode::setMatrix);

  emscripten::class_<RotationNode, emscripten::base<ReactCADNode>>("ReactCADRotationNode")
      .smart_ptr<std::shared_ptr<RotationNode>>("ReactCADRotationNode")
      .function("setAxisAngle", &RotationNode::setAxisAngle)
      .function("setEulerAngles", &RotationNode::setEulerAngles)
      .function("setRotation", &RotationNode::setRotation);

  emscripten::class_<ScaleNode, emscripten::base<ReactCADNode>>("ReactCADScaleNode")
      .smart_ptr<std::shared_ptr<ScaleNode>>("ReactCADScaleNode")
      .function("setCenter", &ScaleNode::setCenter)
      .function("setScaleFactor", &ScaleNode::setScaleFactor)
      .function("setScale", &ScaleNode::setScale);

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
  emscripten::function("render", &render);
  // emscripten::function("setColor", &setColor);
  emscripten::function("setQuality", &setQuality);
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
