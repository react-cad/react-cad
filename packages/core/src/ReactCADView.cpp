// Copyright (c) 2019 OPEN CASCADE SAS
//
// This file is part of the examples of the Open CASCADE Technology software
// library.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE

#include "ReactCADView.hpp"

#include "WasmVKeys.hpp"

#include <AIS_Shape.hxx>
#include <AIS_Trihedron.hxx>
#include <Aspect_DisplayConnection.hxx>
#include <Aspect_Grid.hxx>
#include <Aspect_Handle.hxx>
#include <Aspect_NeutralWindow.hxx>
#include <BRepMesh_DiscretFactory.hxx>
#include <Graphic3d_Camera.hxx>
#include <Message.hxx>
#include <Message_Messenger.hxx>
#include <Message_ProgressScope.hxx>
#include <OpenGl_Context.hxx>
#include <OpenGl_GraphicDriver.hxx>
#include <Prs3d_DatumAspect.hxx>
#include <Quantity_Color.hxx>
#include <V3d_AmbientLight.hxx>
#include <V3d_DirectionalLight.hxx>

#include <emscripten/html5.h>

#include <iostream>

#include "EmJS.hpp"
#include "PerformanceTimer.hpp"
#include "UUID.hpp"
#include "WebGLSentry.hpp"

ReactCADView::ReactCADView(emscripten::val canvas)
    : myDevicePixelRatio(emscripten_get_device_pixel_ratio()), myUpdateRequests(0), myWebglContext(-1),
      myId(UUID::get()), myShape()
{
  SetLockOrbitZUp(true);
  SetShowRotateCenter(false);

  EmJS::initCanvas(canvas, myId);

  initWindow();
  initViewer();

  if (myView.IsNull())
  {
    return;
  }

  myView->MustBeResized();
  myShaded = new AIS_Shape(myShape);
  myContext->Display(myShaded, AIS_Shaded, -1, false);

  myWireframe = new AIS_Shape(myShape);
  myWireframe->SetColor(Quantity_NOC_WHITE);
  myWireframe->SetWidth(2);
  myContext->Display(myWireframe, AIS_WireFrame, -1, false);

  updateView();
}

// ================================================================
// Function : ~ReactCADView
// Purpose  :
// ================================================================
ReactCADView::~ReactCADView()
{
  emscripten_webgl_destroy_context(myWebglContext);
}

void ReactCADView::drawShape(TopoDS_Shape &shape, const Message_ProgressRange &theRange)
{
  Message_ProgressScope scope(theRange, "Rendering", 100);

  PerformanceTimer meshTimer("Mesh timer");

  Standard_Real deviationCoefficent = 0, previousCoeffient = 0, deviationAngle = 0, previousAngle = 0;
  myShaded->OwnDeviationCoefficient(deviationCoefficent, previousCoeffient);
  myShaded->OwnDeviationAngle(deviationAngle, previousAngle);

  Handle(BRepMesh_DiscretRoot) aMeshAlgo =
      BRepMesh_DiscretFactory::Get().Discret(shape, deviationCoefficent, deviationAngle);
  if (!aMeshAlgo.IsNull())
  {
    Message_ProgressScope meshScope(scope.Next(99), "Generating mesh", 1);
    aMeshAlgo->Perform(meshScope.Next());
  }

  meshTimer.end();

  if (scope.More())
  {
    PerformanceTimer displayTimer("Display timer");

    myShaded->SetShape(shape);
    myContext->Redisplay(myShaded, false);
    myWireframe->SetShape(shape);
    myContext->Redisplay(myWireframe, false);

    if (myShowShaded)
    {
      myContext->Display(myShaded, AIS_Shaded, -1, false);
    }

    if (myShowWireframe)
    {
      myContext->Display(myWireframe, AIS_WireFrame, -1, false);
    }

    scope.Next();

    displayTimer.end();
  }
}

void ReactCADView::render(TopoDS_Shape &shape, const Message_ProgressRange &theRange)
{
  {
    Message_ProgressScope scope(theRange, "Rendering", 100);
    if (shape.IsNotEqual(myShape) || myQualityChanged)
    {
      myShape = shape;
      myQualityChanged = false;

#ifdef REACTCAD_DEBUG
      PerformanceTimer timer("Compute mesh");
#endif

      drawShape(shape, scope.Next(99));

#ifdef REACTCAD_DEBUG
      timer.end();
#endif
    }

    myView->Invalidate();
    if (scope.More())
    {
      redrawView();
    }
  }
}

void ReactCADView::setQualitySync(double deviationCoefficent, double angle)
{
  setQuality(deviationCoefficent, angle);
}

void ReactCADView::setQuality(double deviationCoefficent, double angle, const Message_ProgressRange &theRange)
{

  Standard_Real oldCoefficient, previousCoeffient, oldAngle, previousAngle;
  Standard_Boolean initialized = myShaded->OwnDeviationCoefficient(previousCoeffient, oldCoefficient);
  myShaded->OwnDeviationAngle(previousAngle, oldAngle);

  if (!initialized || !IsEqual(deviationCoefficent, previousCoeffient) || !IsEqual(angle, previousAngle))
  {
    myQualityChanged = true;

    Handle(BRepMesh_DiscretRoot) aMeshAlgo =
        BRepMesh_DiscretFactory::Get().Discret(myShape, deviationCoefficent, angle);
    if (!aMeshAlgo.IsNull())
    {
      Message_ProgressScope meshScope(theRange, "Generating mesh", 1);
      aMeshAlgo->Perform(meshScope.Next());
    }

    myShaded->SetOwnDeviationCoefficient(deviationCoefficent);
    myShaded->SetOwnDeviationAngle(angle);
    myWireframe->SetOwnDeviationCoefficient(deviationCoefficent);
    myWireframe->SetOwnDeviationAngle(angle);
  }
}

void ReactCADView::setColor(std::string colorString)
{
  Quantity_Color color;
  Quantity_Color::ColorFromHex(colorString.c_str(), color);
  myShaded->SetColor(color);
  myView->Invalidate();
  updateView();
}

void ReactCADView::zoom(double delta)
{
  Graphic3d_Vec2i aWinSize;
  myView->Window()->Size(aWinSize.x(), aWinSize.y());

  const Graphic3d_Vec2i aNewPos = convertPointToBacking(Graphic3d_Vec2i(aWinSize.x() / 2, aWinSize.y() / 2));

  if (UpdateZoom(Aspect_ScrollDelta(aNewPos, delta)))
  {
    myView->Invalidate();
  }
  updateView();
}

void ReactCADView::resetView()
{
  myView->ResetViewOrientation();
  myView->Invalidate();
  fit();
  updateView();
}

void ReactCADView::fit()
{
  myView->FitAll(0.5, false);
  myView->Invalidate();
  updateView();
}

void ReactCADView::setViewpoint(Viewpoint viewpoint)
{
  switch (viewpoint)
  {
  case Viewpoint::Top:
    myView->SetProj(0, 0, 1);
    myView->SetUp(0, 1, 0);
    break;
  case Viewpoint::Bottom:
    myView->SetProj(0, 0, -1);
    myView->SetUp(0, 1, 0);
    break;
  case Viewpoint::Left:
    myView->SetProj(-1, 0, 0);
    myView->SetUp(0, 0, 1);
    break;
  case Viewpoint::Right:
    myView->SetProj(1, 0, 0);
    myView->SetUp(0, 0, 1);
    break;
  case Viewpoint::Front:
    myView->SetProj(0, -1, 0);
    myView->SetUp(0, 0, 1);
    break;
  case Viewpoint::Back:
    myView->SetProj(0, 1, 0);
    myView->SetUp(0, 0, 1);
    break;
  }
  fit();
  myView->Invalidate();
  updateView();
}

void ReactCADView::setProjection(Graphic3d_Camera::Projection projection)
{
  myView->Camera()->SetProjectionType(projection);
  myView->Invalidate();
  updateView();
}

void ReactCADView::showAxes(bool show)
{
  Handle(V3d_Viewer) aViewer = myView->Viewer();
  aViewer->DisplayPrivilegedPlane(show, 5);

  myView->Invalidate();
  updateView();
}

void ReactCADView::showGrid(bool show)
{
  Handle(V3d_Viewer) aViewer = myView->Viewer();
  if (show)
  {
    aViewer->ActivateGrid(Aspect_GT_Rectangular, Aspect_GDM_Lines);
  }
  else
  {
    aViewer->DeactivateGrid();
  }
  myView->Invalidate();
  updateView();
}

void ReactCADView::showWireframe(bool show)
{
  myShowWireframe = show;
  if (myShowWireframe)
  {
    myContext->Display(myWireframe, AIS_WireFrame, -1, false);
  }
  else
  {
    myContext->Erase(myWireframe, false);
  }
  myView->Invalidate();
  updateView();
}

void ReactCADView::showShaded(bool show)
{
  myShowShaded = show;
  if (myShowShaded)
  {
    myWireframe->SetColor(Quantity_NOC_WHITE);
    myContext->Display(myShaded, AIS_Shaded, -1, false);
  }
  else
  {
    myWireframe->SetColor(Quantity_NOC_HOTPINK);
    myContext->Erase(myShaded, false);
  }
  myView->Invalidate();
  updateView();
}

// ================================================================
// Function : initWindow
// Purpose  :
// ================================================================
void ReactCADView::initWindow()
{
  const char *aTargetId = myId.c_str();
  const EM_BOOL toUseCapture(EM_TRUE);

  emscripten_set_mousedown_callback(aTargetId, this, toUseCapture, onMouseCallback);
  emscripten_set_mouseup_callback(aTargetId, this, toUseCapture, onMouseCallback);
  emscripten_set_mousemove_callback(aTargetId, this, toUseCapture, onMouseCallback);
  emscripten_set_dblclick_callback(aTargetId, this, toUseCapture, onMouseCallback);
  emscripten_set_click_callback(aTargetId, this, toUseCapture, onMouseCallback);
  emscripten_set_mouseenter_callback(aTargetId, this, toUseCapture, onMouseCallback);
  emscripten_set_mouseleave_callback(aTargetId, this, toUseCapture, onMouseCallback);
  emscripten_set_wheel_callback(aTargetId, this, toUseCapture, onWheelCallback);

  emscripten_set_touchstart_callback(aTargetId, this, toUseCapture, onTouchCallback);
  emscripten_set_touchend_callback(aTargetId, this, toUseCapture, onTouchCallback);
  emscripten_set_touchmove_callback(aTargetId, this, toUseCapture, onTouchCallback);
  emscripten_set_touchcancel_callback(aTargetId, this, toUseCapture, onTouchCallback);
}

// ================================================================
// Function : dumpGlInfo
// Purpose  :
// ================================================================
void ReactCADView::dumpGlInfo(bool theIsBasic)
{
  TColStd_IndexedDataMapOfStringString aGlCapsDict;
  myView->DiagnosticInformation(aGlCapsDict,
                                theIsBasic ? Graphic3d_DiagnosticInfo_Basic : Graphic3d_DiagnosticInfo_Complete);
  if (theIsBasic)
  {
    TCollection_AsciiString aViewport;
    aGlCapsDict.FindFromKey("Viewport", aViewport);
    aGlCapsDict.Clear();
    aGlCapsDict.Add("Viewport", aViewport);
  }
  aGlCapsDict.Add("Display scale", TCollection_AsciiString(myDevicePixelRatio));

  // beautify output
  {
    TCollection_AsciiString *aGlVer = aGlCapsDict.ChangeSeek("GLversion");
    TCollection_AsciiString *aGlslVer = aGlCapsDict.ChangeSeek("GLSLversion");
    if (aGlVer != NULL && aGlslVer != NULL)
    {
      *aGlVer = *aGlVer + " [GLSL: " + *aGlslVer + "]";
      aGlslVer->Clear();
    }
  }

  TCollection_AsciiString anInfo;
  for (TColStd_IndexedDataMapOfStringString::Iterator aValueIter(aGlCapsDict); aValueIter.More(); aValueIter.Next())
  {
    if (!aValueIter.Value().IsEmpty())
    {
      if (!anInfo.IsEmpty())
      {
        anInfo += "\n";
      }
      anInfo += aValueIter.Key() + ": " + aValueIter.Value();
    }
  }

  ::Message::DefaultMessenger()->Send(anInfo, Message_Warning);
}

// ================================================================
// Function : initPixelScaleRatio
// Purpose  :
// ================================================================
void ReactCADView::initPixelScaleRatio()
{
  SetTouchToleranceScale(myDevicePixelRatio);
  if (!myView.IsNull())
  {
    myView->ChangeRenderingParams().Resolution = (unsigned int)(96.0 * myDevicePixelRatio + 0.5);
  }
  if (!myContext.IsNull())
  {
    myContext->SetPixelTolerance(int(myDevicePixelRatio * 6.0));
  }
}

// ================================================================
// Function : initViewer
// Purpose  :
// ================================================================
bool ReactCADView::initViewer()
{
  const char *aTargetId = myId.c_str();
  EmscriptenWebGLContextAttributes attributes;
  emscripten_webgl_init_context_attributes(&attributes);
  attributes.alpha = false;
  attributes.powerPreference = EM_WEBGL_POWER_PREFERENCE_HIGH_PERFORMANCE;
  attributes.renderViaOffscreenBackBuffer = true;
  attributes.proxyContextToMainThread = EMSCRIPTEN_WEBGL_CONTEXT_PROXY_ALWAYS;
  myWebglContext = emscripten_webgl_create_context(aTargetId, &attributes);

  WebGLSentry sentry(myWebglContext, myId);

  Handle(Aspect_DisplayConnection) aDisp;

  Handle(OpenGl_GraphicDriver) aDriver = new OpenGl_GraphicDriver(aDisp, false);
  aDriver->ChangeOptions().buffersNoSwap = true;
  // aDriver->ChangeOptions().buffersOpaqueAlpha = true;
  if (!aDriver->InitContext())
  {
    Message::DefaultMessenger()->Send(TCollection_AsciiString("Error: EGL initialization failed"), Message_Fail);
    return false;
  }

  Handle(V3d_Viewer) aViewer = new V3d_Viewer(aDriver);
  aViewer->SetComputedMode(false);
  aViewer->ActivateGrid(Aspect_GT_Rectangular, Aspect_GDM_Lines);
  aViewer->SetRectangularGridValues(0, 0, 1, 1, 0);
  aViewer->SetRectangularGridGraphicValues(100, 100, 0);
  aViewer->Grid()->SetColors(Quantity_NOC_GRAY90, Quantity_NOC_GRAY75);
  aViewer->SetDefaultShadingModel(Graphic3d_TOSM_FRAGMENT);
  gp_Ax3 plane(gp::Origin(), gp::DZ(), gp::DX());
  plane.YReverse();
  aViewer->SetPrivilegedPlane(plane);

  Handle(V3d_DirectionalLight) aDirLight = new V3d_DirectionalLight(V3d_XposZneg, Quantity_NOC_WHITE, Standard_True);
  Handle(V3d_AmbientLight) anAmbLight = new V3d_AmbientLight(Quantity_NOC_WHITE);
  aViewer->AddLight(aDirLight);
  aViewer->SetLightOn(aDirLight);
  aViewer->AddLight(anAmbLight);
  aViewer->SetLightOn(anAmbLight);

  aViewer->SetDefaultBackgroundColor(Quantity_NOC_AZURE);

  Handle(Aspect_NeutralWindow) aWindow = new Aspect_NeutralWindow();
  Graphic3d_Vec2i aWinSize = EmJS::canvasGetSize(myId);
  if (aWinSize.x() < 10 || aWinSize.y() < 10)
  {
    Message::DefaultMessenger()->Send(TCollection_AsciiString("Warning: invalid canvas size"), Message_Warning);
  }
  aWindow->SetSize(aWinSize.x(), aWinSize.y());

  myView = new V3d_View(aViewer);
  myView->SetImmediateUpdate(false);
  myView->ChangeRenderingParams().Resolution = (unsigned int)(96.0 * myDevicePixelRatio + 0.5);
  myView->ChangeRenderingParams().IsAntialiasingEnabled = Standard_True;
  myView->SetWindow(aWindow);

  myTrihedron = new Trihedron();
  myTrihedron->SetLabelsColor(Quantity_NOC_GOLD);
  myTrihedron->SetScale(0.1);
  myTrihedron->SetPosition(Aspect_TOTP_RIGHT_UPPER);
  myTrihedron->SetWireframe(Standard_True);
  myTrihedron->Display(*myView);
  myTrihedron->SetArrowDiameter(2);

#ifdef REACTCAD_DEBUG
  // dumpGlInfo(false);
#endif

  myContext = new AIS_InteractiveContext(aViewer);

  initPixelScaleRatio();
  return true;
}

// ================================================================
// Function : updateView
// Purpose  :
// ================================================================
void ReactCADView::updateView()
{
  if (!myView.IsNull())
  {
    if (++myUpdateRequests == 1)
    {
      emscripten_async_call(onRedrawView, this, 0);
    }
  }
}

// ================================================================
// Function : redrawView
// Purpose  :
// ================================================================
void ReactCADView::redrawView()
{
  if (!myView.IsNull())
  {
    WebGLSentry sentry(myWebglContext, myId);
    FlushViewEvents(myContext, myView, true);
  }
}

// ================================================================
// Function : handleViewRedraw
// Purpose  :
// ================================================================
void ReactCADView::handleViewRedraw(const Handle(AIS_InteractiveContext) & theCtx, const Handle(V3d_View) & theView)
{
  myUpdateRequests = 0;
  AIS_ViewController::handleViewRedraw(theCtx, theView);
  if (myToAskNextFrame)
  {
    // ask more frames
    ++myUpdateRequests;
    emscripten_async_call(onRedrawView, this, 0);
  }
}

void ReactCADView::onResize()
{
  if (myView.IsNull())
  {
    return;
  }

  WebGLSentry sentry(myWebglContext, myId);

  Handle(Aspect_NeutralWindow) aWindow = Handle(Aspect_NeutralWindow)::DownCast(myView->Window());
  Graphic3d_Vec2i aWinSizeOld, aWinSizeNew(EmJS::canvasGetSize(myId));
  if (aWinSizeNew.x() < 10 || aWinSizeNew.y() < 10)
  {
    Message::DefaultMessenger()->Send(TCollection_AsciiString("Warning: invalid canvas size"), Message_Warning);
  }
  aWindow->Size(aWinSizeOld.x(), aWinSizeOld.y());
  const float aPixelRatio = emscripten_get_device_pixel_ratio();
  if (aWinSizeNew != aWinSizeOld || aPixelRatio != myDevicePixelRatio)
  {
    if (myDevicePixelRatio != aPixelRatio)
    {
      myDevicePixelRatio = aPixelRatio;
      initPixelScaleRatio();
    }
    bool ret = aWindow->SetSize(aWinSizeNew.x(), aWinSizeNew.y());
    myView->MustBeResized();
    myView->Invalidate();
    redrawView();
    // dumpGlInfo(true);
  }
}

// ================================================================
// Function : onMouseEvent
// Purpose  :
// ================================================================
EM_BOOL ReactCADView::onMouseEvent(int theEventType, const EmscriptenMouseEvent *theEvent)
{
  if (myView.IsNull())
  {
    return EM_FALSE;
  }

  Graphic3d_Vec2i aWinSize;
  myView->Window()->Size(aWinSize.x(), aWinSize.y());
  const Graphic3d_Vec2i aNewPos = convertPointToBacking(Graphic3d_Vec2i(theEvent->targetX, theEvent->targetY));
  Aspect_VKeyFlags aFlags = 0;
  if (theEvent->ctrlKey == EM_TRUE)
  {
    aFlags |= Aspect_VKeyFlags_CTRL;
  }
  if (theEvent->shiftKey == EM_TRUE)
  {
    aFlags |= Aspect_VKeyFlags_SHIFT;
  }
  if (theEvent->altKey == EM_TRUE)
  {
    aFlags |= Aspect_VKeyFlags_ALT;
  }
  if (theEvent->metaKey == EM_TRUE)
  {
    aFlags |= Aspect_VKeyFlags_META;
  }

  const bool isEmulated = false;
  const Aspect_VKeyMouse aButtons = WasmVKeys_MouseButtonsFromNative(theEvent->buttons);
  switch (theEventType)
  {
  case EMSCRIPTEN_EVENT_MOUSEMOVE: {
    if ((aNewPos.x() < 0 || aNewPos.x() > aWinSize.x() || aNewPos.y() < 0 || aNewPos.y() > aWinSize.y()) &&
        PressedMouseButtons() == Aspect_VKeyMouse_NONE)
    {
      return EM_FALSE;
    }
    if (UpdateMousePosition(aNewPos, aButtons, aFlags, isEmulated))
    {
      updateView();
    }
    break;
  }
  case EMSCRIPTEN_EVENT_MOUSEDOWN:
  case EMSCRIPTEN_EVENT_MOUSEUP: {
    if (aNewPos.x() < 0 || aNewPos.x() > aWinSize.x() || aNewPos.y() < 0 || aNewPos.y() > aWinSize.y())
    {
      return EM_FALSE;
    }
    if (UpdateMouseButtons(aNewPos, aButtons, aFlags, isEmulated))
    {
      updateView();
    }
    return EM_FALSE;
    break;
  }
  case EMSCRIPTEN_EVENT_CLICK:
  case EMSCRIPTEN_EVENT_DBLCLICK: {
    if (aNewPos.x() < 0 || aNewPos.x() > aWinSize.x() || aNewPos.y() < 0 || aNewPos.y() > aWinSize.y())
    {
      return EM_FALSE;
    }
    break;
  }
  case EMSCRIPTEN_EVENT_MOUSEENTER: {
    break;
  }
  case EMSCRIPTEN_EVENT_MOUSELEAVE: {
    // there is no SetCapture() support, so that mouse unclick events outside
    // canvas will not arrive, so we have to forget current state...
    if (UpdateMouseButtons(aNewPos, Aspect_VKeyMouse_NONE, aFlags, isEmulated))
    {
      updateView();
    }
    break;
  }
  }
  return EM_TRUE;
}

// ================================================================
// Function : onWheelEvent
// Purpose  :
// ================================================================
EM_BOOL ReactCADView::onWheelEvent(int theEventType, const EmscriptenWheelEvent *theEvent)
{
  if (myView.IsNull() || theEventType != EMSCRIPTEN_EVENT_WHEEL)
  {
    return EM_FALSE;
  }

  Graphic3d_Vec2i aWinSize;
  myView->Window()->Size(aWinSize.x(), aWinSize.y());
  const Graphic3d_Vec2i aNewPos =
      convertPointToBacking(Graphic3d_Vec2i(theEvent->mouse.targetX, theEvent->mouse.targetY));
  if (aNewPos.x() < 0 || aNewPos.x() > aWinSize.x() || aNewPos.y() < 0 || aNewPos.y() > aWinSize.y())
  {
    return EM_FALSE;
  }

  double aDelta = 0.0;
  switch (theEvent->deltaMode)
  {
  case DOM_DELTA_PIXEL: {
    aDelta = theEvent->deltaY / (5.0 * myDevicePixelRatio);
    break;
  }
  case DOM_DELTA_LINE: {
    aDelta = theEvent->deltaY * 8.0;
    break;
  }
  case DOM_DELTA_PAGE: {
    aDelta = theEvent->deltaY >= 0.0 ? 24.0 : -24.0;
    break;
  }
  }

  if (UpdateZoom(Aspect_ScrollDelta(aNewPos, -aDelta)))
  {
    updateView();
  }
  return EM_TRUE;
}

// ================================================================
// Function : onTouchEvent
// Purpose  :
// ================================================================
EM_BOOL ReactCADView::onTouchEvent(int theEventType, const EmscriptenTouchEvent *theEvent)
{
  const double aClickTolerance = 5.0;
  if (myView.IsNull())
  {
    return EM_FALSE;
  }

  Graphic3d_Vec2i aWinSize;
  myView->Window()->Size(aWinSize.x(), aWinSize.y());
  bool hasUpdates = false;
  for (int aTouchIter = 0; aTouchIter < theEvent->numTouches; ++aTouchIter)
  {
    const EmscriptenTouchPoint &aTouch = theEvent->touches[aTouchIter];
    if (!aTouch.isChanged)
    {
      continue;
    }

    const Standard_Size aTouchId = (Standard_Size)aTouch.identifier;
    const Graphic3d_Vec2i aNewPos = convertPointToBacking(Graphic3d_Vec2i(aTouch.canvasX, aTouch.canvasY));
    switch (theEventType)
    {
    case EMSCRIPTEN_EVENT_TOUCHSTART: {
      if (aNewPos.x() >= 0 && aNewPos.x() < aWinSize.x() && aNewPos.y() >= 0 && aNewPos.y() < aWinSize.y())
      {
        hasUpdates = true;
        AddTouchPoint(aTouchId, Graphic3d_Vec2d(aNewPos));
        myClickTouch.From.SetValues(-1.0, -1.0);
        if (myTouchPoints.Extent() == 1)
        {
          myClickTouch.From = Graphic3d_Vec2d(aNewPos);
        }
      }
      break;
    }
    case EMSCRIPTEN_EVENT_TOUCHMOVE: {
      const int anOldIndex = myTouchPoints.FindIndex(aTouchId);
      if (anOldIndex != 0)
      {
        hasUpdates = true;
        UpdateTouchPoint(aTouchId, Graphic3d_Vec2d(aNewPos));
        if (myTouchPoints.Extent() == 1 &&
            (myClickTouch.From - Graphic3d_Vec2d(aNewPos)).cwiseAbs().maxComp() > aClickTolerance)
        {
          myClickTouch.From.SetValues(-1.0, -1.0);
        }
      }
      break;
    }
    case EMSCRIPTEN_EVENT_TOUCHEND:
    case EMSCRIPTEN_EVENT_TOUCHCANCEL: {
      if (RemoveTouchPoint(aTouchId))
      {
        if (myTouchPoints.IsEmpty() && myClickTouch.From.minComp() >= 0.0)
        {
          if (myDoubleTapTimer.IsStarted() && myDoubleTapTimer.ElapsedTime() <= myMouseDoubleClickInt)
          {
            fit();
          }
          else
          {
            myDoubleTapTimer.Stop();
            myDoubleTapTimer.Reset();
            myDoubleTapTimer.Start();
            SelectInViewer(Graphic3d_Vec2i(myClickTouch.From));
          }
        }
        hasUpdates = true;
      }
      break;
    }
    }
  }
  if (hasUpdates)
  {
    updateView();
  }
  return hasUpdates || !myTouchPoints.IsEmpty() ? EM_TRUE : EM_FALSE;
}
