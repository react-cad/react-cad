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
#include "SolidNode.hpp"
#include "SphereNode.hpp"
#include "TorusNode.hpp"
#include "WedgeNode.hpp"

#include "DifferenceNode.hpp"
#include "IntersectionNode.hpp"
#include "UnionNode.hpp"

#include "EvolutionNode.hpp"
#include "HelixNode.hpp"
#include "LoftNode.hpp"
#include "PipeNode.hpp"
#include "PrismNode.hpp"
#include "RevolutionNode.hpp"

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

#include "SVG.hpp"

#include "CylindricalSurfaceNode.hpp"
#include "PlaneNode.hpp"
#include "SphericalSurfaceNode.hpp"
#include "SurfaceNode.hpp"

#include <Graphic3d_Camera.hxx>
#include <Message.hxx>
#include <Message_Messenger.hxx>
#include <Message_PrinterSystemLog.hxx>
#include <NCollection_Array1.hxx>
#include <OSD_MemInfo.hxx>
#include <OSD_Parallel.hxx>
#include <TCollection_AsciiString.hxx>
#include <gp_Pnt.hxx>
#include <gp_Vec.hxx>

#include <Standard_ArrayStreamBuffer.hxx>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5.h>

#include "Async.hpp"
#include "ProgressHandler.hpp"
#include "ProgressIndicator.hpp"
#include "UUID.hpp"
#include "export.hpp"

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
  if (type == "loft")
  {
    return new LoftNode();
  }
  if (type == "intersection")
  {
    return new IntersectionNode();
  }
  if (type == "solid")
  {
    return new SolidNode();
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
  if (type == "plane")
  {
    return new PlaneNode();
  }
  if (type == "sphericalSurface")
  {
    return new SphericalSurfaceNode();
  }
  if (type == "cylindricalSurface")
  {
    return new CylindricalSurfaceNode();
  }

  return new BoxNode();
}

Handle(SVG) createSVG()
{
  return new SVG();
}

Handle(ReactCADView) createView(emscripten::val canvas)
{
  return new ReactCADView(canvas);
}

Handle(ProgressIndicator) computeNodeAsync(Handle(ReactCADNode) & node)
{
  return Async::Perform([=](const ProgressHandler &handler) { node->computeGeometry(handler); });
}

Handle(ProgressIndicator) renderNodeAsync(Handle(ReactCADNode) & node, Handle(ReactCADView) & view)
{
  return Async::Perform([=](const ProgressHandler &handler) {
    Message_ProgressScope scope(handler, "Computing shape", 101);
    scope.Next();
    node->computeGeometry(handler.WithRange(scope.Next(50)));
    if (scope.More())
    {
      TopoDS_Shape shape = node->getShape();
      view->render(shape, scope.Next(50));
    }
  });
}

Handle(ProgressIndicator)
    setRenderQuality(Handle(ReactCADView) & view, double linearDeflection, double angularDeflection)
{
  return Async::Perform([=](const Message_ProgressRange &progressRange) {
    view->setQuality(linearDeflection, angularDeflection, progressRange);
  });
}

#ifdef REACTCAD_DEBUG
Handle(ProgressIndicator) testProgress()
{
  return Async::Perform([](const Message_ProgressRange &progressRange) {
    Message_ProgressScope scope(progressRange, "Task", 10);
    for (int i = 0; i < 10 && scope.More(); ++i)
    {
      scope.Next();
      usleep(10000);
    }
  });
}
#endif

//! Dummy main loop callback for a single shot.
extern "C" void onMainLoop()
{
  // do nothing here - viewer updates are handled on demand
}

int main()
{
#ifdef REACTCAD_DEBUG
  Message::DefaultMessenger()->Printers().First()->SetTraceLevel(Message_Trace);
  Message::DefaultMessenger()->Send(
      TCollection_AsciiString("NbLogicalProcessors: ") + OSD_Parallel::NbLogicalProcessors(), Message_Trace);
  Message::DefaultMessenger()->Send(OSD_MemInfo::PrintInfo(), Message_Trace);
#endif

  emscripten_set_main_loop(onMainLoop, 1, 0);

  return 0;
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
//

EMSCRIPTEN_BINDINGS(react_cad)
{

  // Base node
  emscripten::class_<ReactCADNode>("ReactCADNode")
      .smart_ptr<Handle(ReactCADNode)>("ReactCADNode")
      .function("appendChild", &ReactCADNode::appendChild)
      .function("insertChildBefore", &ReactCADNode::insertChildBefore)
      .function("removeChild", &ReactCADNode::removeChild)
      .function("hasParent", &ReactCADNode::hasParent);

  emscripten::class_<ReactCADView>("ReactCADView")
      .smart_ptr<Handle(ReactCADView)>("ReactCADView")
      .function("render", &ReactCADView::render)
      // .function("setColor", &ReactCADView::setColor)
      .function("zoom", &ReactCADView::zoom)
      .function("setQuality", &ReactCADView::setQualitySync)
      .function("resetView", &ReactCADView::resetView)
      .function("fit", &ReactCADView::fit)
      .function("setViewpoint", &ReactCADView::setViewpoint)
      .function("setProjection", &ReactCADView::setProjection)
      .function("showAxes", &ReactCADView::showAxes)
      .function("showGrid", &ReactCADView::showGrid)
      .function("showWireframe", &ReactCADView::showWireframe)
      .function("showShaded", &ReactCADView::showShaded)
      .function("onResize", &ReactCADView::onResize);

  emscripten::class_<ProgressIndicator>("ProgressIndicator")
      .smart_ptr<Handle(ProgressIndicator)>("ProgressIndicator")
      .function("subscribe", &ProgressIndicator::subscribe)
      .function("unsubscribe", &ProgressIndicator::unsubscribe)
      .function("then", &ProgressIndicator::then)
      .function("then", &ProgressIndicator::thenCatch)
      .function("catch", &ProgressIndicator::catchError)
      .function("isFulfilled", &ProgressIndicator::isFulfilled)
      .function("cancel", &ProgressIndicator::cancel);

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
  emscripten::class_<BoxNode, emscripten::base<ReactCADNode>>("ReactCADBoxNode")
      .smart_ptr<Handle(BoxNode)>("ReactCADBoxNode")
      .function("setSize", &BoxNode::setSize)
      .function("setCentered", &BoxNode::setCentered);

  emscripten::class_<WedgeNode, emscripten::base<ReactCADNode>>("ReactCADWedgeNode")
      .smart_ptr<Handle(WedgeNode)>("ReactCADWedgeNode")
      .function("setSize", &WedgeNode::setSize)
      .function("setLtx", &WedgeNode::setLtx)
      .function("setMinMax", &WedgeNode::setMinMax);

  emscripten::class_<ConeNode, emscripten::base<ReactCADNode>>("ReactCADConeNode")
      .smart_ptr<Handle(ConeNode)>("ReactCADConeNode")
      .function("setSize", &ConeNode::setSize)
      .function("setAngle", &ConeNode::setAngle)
      .function("setCentered", &ConeNode::setCentered);

  emscripten::class_<CylinderNode, emscripten::base<ReactCADNode>>("ReactCADCylinderNode")
      .smart_ptr<Handle(CylinderNode)>("ReactCADCylinderNode")
      .function("setSize", &CylinderNode::setSize)
      .function("setAngle", &CylinderNode::setAngle)
      .function("setCentered", &CylinderNode::setCentered);

  emscripten::class_<TorusNode, emscripten::base<ReactCADNode>>("ReactCADTorusNode")
      .smart_ptr<Handle(TorusNode)>("ReactCADTorusNode")
      .function("setSize", &TorusNode::setSize)
      .function("setAngle", &TorusNode::setAngle);

  emscripten::class_<SphereNode, emscripten::base<ReactCADNode>>("ReactCADSphereNode")
      .smart_ptr<Handle(SphereNode)>("ReactCADSphereNode")
      .function("setRadius", &SphereNode::setRadius)
      .function("setAngle", &SphereNode::setAngle)
      .function("setSegment", &SphereNode::setSegment);

  emscripten::class_<PolyhedronNode, emscripten::base<ReactCADNode>>("ReactCADPolyhedronNode")
      .smart_ptr<Handle(PolyhedronNode)>("ReactCADPolyhedronNode")
      .function("setPointsAndFaces", &PolyhedronNode::setPointsAndFaces);

  emscripten::class_<SolidNode, emscripten::base<ReactCADNode>>("ReactCADSolidNode")
      .smart_ptr<Handle(SolidNode)>("ReactCADSolidNode");

  // Sweeps
  emscripten::class_<PrismNode, emscripten::base<ReactCADNode>>("ReactCADPrismNode")
      .smart_ptr<Handle(PrismNode)>("ReactCADPrismNode")
      .function("setVector", &PrismNode::setVector);

  emscripten::class_<EvolutionNode, emscripten::base<ReactCADNode>>("ReactCADEvolutionNode")
      .smart_ptr<Handle(EvolutionNode)>("ReactCADEvolutionNode")
      .function("setProfile", &EvolutionNode::setProfile);

  emscripten::class_<RevolutionNode, emscripten::base<ReactCADNode>>("ReactCADRevolutionNode")
      .smart_ptr<Handle(RevolutionNode)>("ReactCADRevolutionNode")
      .function("setAxisAngle", &RevolutionNode::setAxisAngle);

  emscripten::class_<HelixNode, emscripten::base<ReactCADNode>>("ReactCADHelixNode")
      .smart_ptr<Handle(HelixNode)>("ReactCADHelixNode")
      .function("setPitch", &HelixNode::setPitch)
      .function("setHeight", &HelixNode::setHeight)
      .function("setLeftHanded", &HelixNode::setLeftHanded);

  emscripten::class_<PipeNode, emscripten::base<ReactCADNode>>("ReactCADPipeNode")
      .smart_ptr<Handle(PipeNode)>("ReactCADPipeNode")
      .function("setSpine", &PipeNode::setSpine);

  emscripten::class_<LoftNode, emscripten::base<ReactCADNode>>("ReactCADLoftNode")
      .smart_ptr<Handle(LoftNode)>("ReactCADLoftNode")
      .function("setCompatible", &LoftNode::setCompatible)
      .function("setSmooth", &LoftNode::setSmooth);

  // Imports
  emscripten::class_<ImportNode, emscripten::base<ReactCADNode>>("ReactCADImportNode")
      .smart_ptr<Handle(ImportNode)>("ReactCADImportNode")
      .function("setFileContents", &ImportNode::setFileContents);

  emscripten::class_<BRepImportNode, emscripten::base<ImportNode>>("ReactCADBRepImportNode")
      .smart_ptr<Handle(BRepImportNode)>("ReactCADBRepImportNode");

  emscripten::class_<STEPImportNode, emscripten::base<ImportNode>>("ReactCADSTEPImportNode")
      .smart_ptr<Handle(STEPImportNode)>("ReactCADSTEPImportNode");

  emscripten::class_<STLImportNode, emscripten::base<ImportNode>>("ReactCADSTLImportNode")
      .smart_ptr<Handle(STLImportNode)>("ReactCADSTLImportNode");

  emscripten::class_<ObjImportNode, emscripten::base<ImportNode>>("ReactCADObjImportNode")
      .smart_ptr<Handle(ObjImportNode)>("ReactCADObjImportNode");

  // Transformations
  emscripten::class_<TranslationNode, emscripten::base<ReactCADNode>>("ReactCADTranslationNode")
      .smart_ptr<Handle(TranslationNode)>("ReactCADTranslationNode")
      .function("setVector", &TranslationNode::setVector);

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

  // Surfaces
  emscripten::class_<SVG>("ReactCADSVG").smart_ptr<Handle(SVG)>("ReactCADSVG").function("setSource", &SVG::setSource);

  emscripten::class_<SurfaceNode, emscripten::base<ReactCADNode>>("ReactCADSurfaceNode")
      .smart_ptr<Handle(SurfaceNode)>("ReactCADSurfaceNode")
      .function("appendSVG", &SurfaceNode::appendSVG)
      .function("insertSVGBefore", &SurfaceNode::insertSVGBefore)
      .function("removeSVG", &SurfaceNode::removeSVG)
      .function("updateSVGs", &SurfaceNode::updateSVGs);

  emscripten::class_<PlaneNode, emscripten::base<SurfaceNode>>("ReactCADPlaneNode")
      .smart_ptr<Handle(PlaneNode)>("ReactCADPlaneNode")
      .function("setOrigin", &PlaneNode::setOrigin);

  emscripten::class_<SphericalSurfaceNode, emscripten::base<SurfaceNode>>("ReactCADSphericalSurfaceNode")
      .smart_ptr<Handle(SphericalSurfaceNode)>("ReactCADSphericalSurfaceNode")
      .function("setRadius", &SphericalSurfaceNode::setRadius)
      .function("setOrigin", &SphericalSurfaceNode::setOrigin);

  emscripten::class_<CylindricalSurfaceNode, emscripten::base<SurfaceNode>>("ReactCADCylindricalSurfaceNode")
      .smart_ptr<Handle(CylindricalSurfaceNode)>("ReactCADCylindricalSurfaceNode")
      .function("setRadius", &CylindricalSurfaceNode::setRadius)
      .function("setOrigin", &CylindricalSurfaceNode::setOrigin);

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

  emscripten::constant("PRECISION", Precision::Confusion());
  emscripten::constant("ANGULAR_PRECISION", Precision::Angular());
  emscripten::constant("APPROXIMATION_PRECISION", Precision::Approximation());

  emscripten::function("createCADNode", &createCADNode);
  emscripten::function("createSVG", &createSVG);
  emscripten::function("createView", &createView);
  emscripten::function("renderSTL", &renderSTL);
  emscripten::function("renderBREP", &renderBREP);
  emscripten::function("renderSTEP", &renderSTEP);
  emscripten::function("computeNodeAsync", &computeNodeAsync);
  emscripten::function("renderNodeAsync", &renderNodeAsync);
  emscripten::function("setRenderQuality", &setRenderQuality);
#ifdef REACTCAD_DEBUG
  emscripten::function("testProgress", &testProgress);
#endif
}
