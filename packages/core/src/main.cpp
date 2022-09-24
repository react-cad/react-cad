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

#include "EvolutionNode.hpp"
#include "HelixNode.hpp"
#include "PipeNode.hpp"
#include "PrismNode.hpp"
#include "RevolutionNode.hpp"
#include "SweepNode.hpp"

#include "BRepImportNode.hpp"
#include "ImportNode.hpp"
#include "ObjImportNode.hpp"
#include "STEPImportNode.hpp"
#include "STLImportNode.hpp"

#include "AffineNode.hpp"
#include "MirrorNode.hpp"
#include "RotationNode.hpp"
#include "ScaleNode.hpp"
#include "TranslationNode.hpp"

#include <BRepMesh_IncrementalMesh.hxx>
#include <Graphic3d_Camera.hxx>
#include <Message.hxx>
#include <Message_Messenger.hxx>
#include <Message_PrinterSystemLog.hxx>
#include <NCollection_Array1.hxx>
#include <OSD_MemInfo.hxx>
#include <OSD_Parallel.hxx>
#include <StlAPI.hxx>
#include <TCollection_AsciiString.hxx>
#include <gp_Pnt.hxx>
#include <gp_Vec.hxx>

#include <Standard_ArrayStreamBuffer.hxx>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5.h>

#include <pthread.h>

Handle(ReactCADNode) createCADNode(std::string type)
{
  if (type == "box")
  {
    return new BoxNode();
  }
  if (type == "wedge")
  {
    return new WedgeNode();
  }
  if (type == "cone")
  {
    return new ConeNode();
  }
  if (type == "cylinder")
  {
    return new CylinderNode();
  }
  if (type == "difference")
  {
    return new DifferenceNode();
  }
  if (type == "pipe")
  {
    return new PipeNode();
  }
  if (type == "helix")
  {
    return new HelixNode();
  }
  if (type == "intersection")
  {
    return new IntersectionNode();
  }
  if (type == "polyhedron")
  {
    return new PolyhedronNode();
  }
  if (type == "evolution")
  {
    return new EvolutionNode();
  }
  if (type == "prism")
  {
    return new PrismNode();
  }
  if (type == "revolution")
  {
    return new RevolutionNode();
  }
  if (type == "mirror")
  {
    return new MirrorNode();
  }
  if (type == "affine")
  {
    return new AffineNode();
  }
  if (type == "rotation")
  {
    return new RotationNode();
  }
  if (type == "scale")
  {
    return new ScaleNode();
  }
  if (type == "sphere")
  {
    return new SphereNode();
  }
  if (type == "torus")
  {
    return new TorusNode();
  }
  if (type == "translation")
  {
    return new TranslationNode();
  }
  if (type == "union")
  {
    return new UnionNode();
  }
  if (type == "brep")
  {
    return new BRepImportNode();
  }
  if (type == "step")
  {
    return new STEPImportNode();
  }
  if (type == "obj")
  {
    return new ObjImportNode();
  }
  if (type == "stl")
  {
    return new STLImportNode();
  }

  return new BoxNode();
}

struct RenderRequest
{
  Handle(ReactCADNode) node;
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

    Handle(ReactCADView) view = ReactCADView::getView();

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

void render(Handle(ReactCADNode) node, bool reset = false)
{
  pthread_mutex_lock(&render_mutex);
  renderQueue.push_back({node, reset});
  pthread_cond_signal(&render_cond);
  pthread_mutex_unlock(&render_mutex);
}

void resetView()
{
  ReactCADView::getView()->resetView();
}

void setQuality(double deviationCoefficent, double angle)
{
  ReactCADView::getView()->setQuality(deviationCoefficent, angle);
}

void setColor(std::string color)
{
  ReactCADView::getView()->setColor(color);
}

void zoom(double delta)
{
  ReactCADView::getView()->zoom(delta);
}

void fit()
{
  ReactCADView::getView()->fit();
}

void setViewpoint(ReactCADView::Viewpoint viewpoint)
{
  ReactCADView::getView()->setViewpoint(viewpoint);
}

void setProjection(Graphic3d_Camera::Projection projection)
{
  ReactCADView::getView()->setProjection(projection);
}

void showAxes(bool show)
{
  ReactCADView::getView()->showAxes(show);
}

void showGrid(bool show)
{
  ReactCADView::getView()->showGrid(show);
}

void showWireframe(bool show)
{
  ReactCADView::getView()->showWireframe(show);
}

void showShaded(bool show)
{
  ReactCADView::getView()->showShaded(show);
}

void onResize()
{
  ReactCADView::getView()->onResize();
}

Standard_Boolean writeSTL(const Handle(ReactCADNode) & node, const std::string filename,
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

template <typename T, typename... Policies>
NCollection_Array1<T> nCollectionArrayFromJSArray(const val &v, Policies... policies)
{
  const size_t l = v["length"].as<size_t>();

  NCollection_Array1<T> rv(0, l - 1);
  for (size_t i = 0; i < l; ++i)
  {
    rv[i] = (v[i].as<T>(std::forward<Policies>(policies)...));
  }

  return rv;
}

template <typename T> struct BindingType<NCollection_Array1<T>>
{
  using ValBinding = BindingType<val>;
  using WireType = ValBinding::WireType;

  static NCollection_Array1<T> fromWireType(WireType value)
  {
    return nCollectionArrayFromJSArray<T>(ValBinding::fromWireType(value));
  }
};

template <typename T>
struct TypeID<
    T, typename std::enable_if_t<std::is_same<typename Canonicalized<T>::type,
                                              NCollection_Array1<typename Canonicalized<T>::type::value_type>>::value>>
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
      .smart_ptr<Handle(ReactCADNode)>("ReactCADNode")
      .function("appendChild", &ReactCADNode::appendChild)
      .function("insertChildBefore", &ReactCADNode::insertChildBefore)
      .function("removeChild", &ReactCADNode::removeChild)
      .function("hasParent", &ReactCADNode::hasParent);

  emscripten::value_array<gp_Pnt>("Point")
      .element(&gp_Pnt::X, &gp_Pnt::SetX)
      .element(&gp_Pnt::Y, &gp_Pnt::SetY)
      .element(&gp_Pnt::Z, &gp_Pnt::SetZ);

  emscripten::value_array<gp_Vec>("Vector")
      .element(&gp_Vec::X, &gp_Vec::SetX)
      .element(&gp_Vec::Y, &gp_Vec::SetY)
      .element(&gp_Vec::Z, &gp_Vec::SetZ);

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
      .smart_ptr<Handle(BoxNode)>("ReactCADBoxNode")
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
      .smart_ptr<Handle(WedgeNode)>("ReactCADWedgeNode")
      .function("setPropsLtx", &WedgeNode::setPropsLtx)
      .function("setPropsMinMax", &WedgeNode::setPropsMinMax);

  emscripten::value_object<ConeProps>("ConeProps")
      .field("center", &ConeProps::center)
      .field("radius1", &ConeProps::radius1)
      .field("radius2", &ConeProps::radius2)
      .field("height", &ConeProps::height)
      .field("angle", &ConeProps::angle);
  emscripten::class_<ConeNode, emscripten::base<ReactCADNode>>("ReactCADConeNode")
      .smart_ptr<Handle(ConeNode)>("ReactCADConeNode")
      .function("setProps", &ConeNode::setProps);

  emscripten::value_object<CylinderProps>("CylinderProps")
      .field("center", &CylinderProps::center)
      .field("radius", &CylinderProps::radius)
      .field("height", &CylinderProps::height)
      .field("angle", &CylinderProps::angle);
  emscripten::class_<CylinderNode, emscripten::base<ReactCADNode>>("ReactCADCylinderNode")
      .smart_ptr<Handle(CylinderNode)>("ReactCADCylinderNode")
      .function("setProps", &CylinderNode::setProps);

  emscripten::value_object<TorusProps>("TorusProps")
      .field("radius1", &TorusProps::radius1)
      .field("radius2", &TorusProps::radius2)
      .field("angle", &TorusProps::angle);
  emscripten::class_<TorusNode, emscripten::base<ReactCADNode>>("ReactCADTorusNode")
      .smart_ptr<Handle(TorusNode)>("ReactCADTorusNode")
      .function("setProps", &TorusNode::setProps);

  emscripten::value_object<SphereProps>("SphereProps")
      .field("radius", &SphereProps::radius)
      .field("angle", &SphereProps::angle)
      .field("segmentAngle1", &SphereProps::segmentAngle1)
      .field("segmentAngle2", &SphereProps::segmentAngle2);
  emscripten::class_<SphereNode, emscripten::base<ReactCADNode>>("ReactCADSphereNode")
      .smart_ptr<Handle(SphereNode)>("ReactCADSphereNode")
      .function("setProps", &SphereNode::setProps);

  emscripten::class_<PolyhedronNode, emscripten::base<ReactCADNode>>("ReactCADPolyhedronNode")
      .smart_ptr<Handle(PolyhedronNode)>("ReactCADPolyhedronNode")
      .function("setPointsAndFaces", &PolyhedronNode::setPointsAndFaces);

  // Sweeps
  emscripten::class_<SweepNode, emscripten::base<ReactCADNode>>("ReactCADSweepNode")
      .smart_ptr<Handle(SweepNode)>("ReactCADSweepNode")
      .function("setProfile", &SweepNode::setProfile)
      .function("setProfileSVG", &SweepNode::setProfileSVG);

  emscripten::class_<PrismNode, emscripten::base<SweepNode>>("ReactCADPrismNode")
      .smart_ptr<Handle(PrismNode)>("ReactCADPrismNode")
      .function("setVector", &PrismNode::setVector);

  emscripten::class_<EvolutionNode, emscripten::base<ReactCADNode>>("ReactCADEvolutionNode")
      .smart_ptr<Handle(EvolutionNode)>("ReactCADEvolutionNode")
      .function("setProfile", &EvolutionNode::setProfile)
      .function("setProfileSVG", &EvolutionNode::setProfileSVG)
      .function("setSpine", &EvolutionNode::setSpine)
      .function("setSpineSVG", &EvolutionNode::setSpineSVG);

  emscripten::class_<RevolutionNode, emscripten::base<SweepNode>>("ReactCADRevolutionNode")
      .smart_ptr<Handle(RevolutionNode)>("ReactCADRevolutionNode")
      .function("setAxisAngle", &RevolutionNode::setAxisAngle);

  emscripten::class_<HelixNode, emscripten::base<SweepNode>>("ReactCADHelixNode")
      .smart_ptr<Handle(HelixNode)>("ReactCADHelixNode")
      .function("setPitch", &HelixNode::setPitch)
      .function("setHeight", &HelixNode::setHeight);

  emscripten::class_<PipeNode, emscripten::base<SweepNode>>("ReactCADPipeNode")
      .smart_ptr<Handle(PipeNode)>("ReactCADPipeNode")
      .function("setSpine", &PipeNode::setSpine)
      .function("setSpineSVG", &PipeNode::setSpineSVG);

  // Imports
  emscripten::class_<ImportNode, emscripten::base<ReactCADNode>>("ReactCADImportNode")
      .smart_ptr<Handle(ImportNode)>("ReactCADImportNode")
      .function("setFilename", &ImportNode::setFilename)
      .function("getFilename", &ImportNode::getFilename);

  emscripten::class_<BRepImportNode, emscripten::base<ImportNode>>("ReactCADBRepImportNode")
      .smart_ptr<Handle(BRepImportNode)>("ReactCADBRepImportNode");

  emscripten::class_<STEPImportNode, emscripten::base<ImportNode>>("ReactCADSTEPImportNode")
      .smart_ptr<Handle(STEPImportNode)>("ReactCADSTEPImportNode");

  emscripten::class_<STLImportNode, emscripten::base<ImportNode>>("ReactCADSTLImportNode")
      .smart_ptr<Handle(STLImportNode)>("ReactCADSTLImportNode");

  emscripten::class_<ObjImportNode, emscripten::base<ImportNode>>("ReactCADObjImportNode")
      .smart_ptr<Handle(ObjImportNode)>("ReactCADObjImportNode");

  // Transformations
  emscripten::value_object<TranslationProps>("TranslationProps")
      .field("x", &TranslationProps::x)
      .field("y", &TranslationProps::y)
      .field("z", &TranslationProps::z);
  emscripten::class_<TranslationNode, emscripten::base<ReactCADNode>>("ReactCADTranslationNode")
      .smart_ptr<Handle(TranslationNode)>("ReactCADTranslationNode")
      .function("setProps", &TranslationNode::setProps);

  emscripten::class_<MirrorNode, emscripten::base<ReactCADNode>>("ReactCADMirrorNode")
      .smart_ptr<Handle(MirrorNode)>("ReactCADMirrorNode")
      .function("setPlane", &MirrorNode::setPlane);

  emscripten::class_<AffineNode, emscripten::base<ReactCADNode>>("ReactCADAffineNode")
      .smart_ptr<Handle(AffineNode)>("ReactCADAffineNode")
      .function("setMatrix", &AffineNode::setMatrix);

  emscripten::class_<RotationNode, emscripten::base<ReactCADNode>>("ReactCADRotationNode")
      .smart_ptr<Handle(RotationNode)>("ReactCADRotationNode")
      .function("setAxisAngle", &RotationNode::setAxisAngle)
      .function("setEulerAngles", &RotationNode::setEulerAngles)
      .function("setRotation", &RotationNode::setRotation);

  emscripten::class_<ScaleNode, emscripten::base<ReactCADNode>>("ReactCADScaleNode")
      .smart_ptr<Handle(ScaleNode)>("ReactCADScaleNode")
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
