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

#include "ReactCADView.h"

#include "WasmVKeys.h"

#include <AIS_Shape.hxx>
#include <Aspect_DisplayConnection.hxx>
#include <Aspect_Handle.hxx>
#include <Aspect_NeutralWindow.hxx>
#include <Message.hxx>
#include <Message_Messenger.hxx>
#include <OpenGl_GraphicDriver.hxx>
#include <Prs3d_DatumAspect.hxx>

#include <iostream>

// clang-format off
namespace
{
  EM_JS(void, jsInitCanvas, (), {
    specialHTMLTargets["!canvas"] = Module.canvas;
  });

  EM_JS(int, jsCanvasGetWidth, (), {
    return Module.canvas.width;
  });

  EM_JS(int, jsCanvasGetHeight, (), {
    return Module.canvas.height;
  });

  EM_JS(float, jsDevicePixelRatio, (), {
    var aDevicePixelRatio = window.devicePixelRatio || 1;
    return aDevicePixelRatio;
  });

  //! Return cavas size in pixels.
  static Graphic3d_Vec2i jsCanvasSize()
  {
    return Graphic3d_Vec2i (jsCanvasGetWidth(), jsCanvasGetHeight());
  }
} // namespace
// clang-format on

std::shared_ptr<ReactCADView> ReactCADView::singleton = nullptr;

std::shared_ptr<ReactCADView> ReactCADView::getView()
{
  if (singleton == nullptr)
  {
    singleton.reset(new ReactCADView());
  }
  return singleton;
}

ReactCADView::ReactCADView() : myDevicePixelRatio(jsDevicePixelRatio()), myUpdateRequests(0)
{
  initWindow();
  initViewer();
  initDemoScene();
  if (myView.IsNull())
  {
    return;
  }

  myView->MustBeResized();
  myView->Redraw();
}

// ================================================================
// Function : ~ReactCADView
// Purpose  :
// ================================================================
ReactCADView::~ReactCADView()
{
}

void ReactCADView::addNode(std::shared_ptr<ReactCADNode> node)
{
  Handle(AIS_Shape) shape = new AIS_Shape(TopoDS_Shape());
  shape->SetMaterial(Graphic3d_NameOfMaterial_Aluminum);
  myContext->Display(shape, AIS_Shaded, 0, false);
  myView->Redraw();
  myNodes.insert(std::pair<std::shared_ptr<ReactCADNode>, Handle(AIS_Shape)>(node, shape));
}

void ReactCADView::removeNode(std::shared_ptr<ReactCADNode> node)
{
  Handle(AIS_Shape) shape = myNodes.at(node);
  myContext->Remove(shape, false);
  myView->Redraw();
  myNodes.erase(node);
}

void ReactCADView::renderNodes()
{
  for (auto it = std::begin(myNodes); it != std::end(myNodes); ++it)
  {
    std::shared_ptr<ReactCADNode> node = it->first;
    Handle(AIS_Shape) shape = it->second;
    node->renderTree();
    shape->SetShape(node->shape);
    myContext->Redisplay(shape, false, true);
  }
  myView->Redraw();
}

void ReactCADView::fit()
{
  myView->FitAll(0.1, false);
  myView->Redraw();
}

// ================================================================
// Function : initWindow
// Purpose  :
// ================================================================
void ReactCADView::initWindow()
{
  jsInitCanvas();
  const char *aTargetId = "!canvas";
  const EM_BOOL toUseCapture(EM_TRUE);
  emscripten_set_resize_callback(EMSCRIPTEN_EVENT_TARGET_WINDOW, this, toUseCapture, onResizeCallback);

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

  // emscripten_set_keypress_callback   (EMSCRIPTEN_EVENT_TARGET_WINDOW, this,
  // toUseCapture, onKeyCallback);
  emscripten_set_keydown_callback(EMSCRIPTEN_EVENT_TARGET_WINDOW, this, toUseCapture, onKeyDownCallback);
  emscripten_set_keyup_callback(EMSCRIPTEN_EVENT_TARGET_WINDOW, this, toUseCapture, onKeyUpCallback);
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
  // Build with "--preload-file MyFontFile.ttf" option
  // and register font in Font Manager to use custom font(s).
  /*const char* aFontPath = "MyFontFile.ttf";
  if (Handle(Font_SystemFont) aFont = Font_FontMgr::GetInstance()->CheckFont
  (aFontPath))
  {
    Font_FontMgr::GetInstance()->RegisterFont (aFont, true);
  }
  else
  {
    Message::DefaultMessenger()->Send (TCollection_AsciiString ("Error: font '")
  + aFontPath + "' is not found", Message_Fail);
  }*/

  Handle(Aspect_DisplayConnection) aDisp;
  Handle(OpenGl_GraphicDriver) aDriver = new OpenGl_GraphicDriver(aDisp, false);
  aDriver->ChangeOptions().buffersNoSwap = true; // swap has no effect in WebGL
  if (!aDriver->InitContext())
  {
    Message::DefaultMessenger()->Send(TCollection_AsciiString("Error: EGL initialization failed"), Message_Fail);
    return false;
  }

  Handle(V3d_Viewer) aViewer = new V3d_Viewer(aDriver);
  aViewer->SetComputedMode(false);
  aViewer->ActivateGrid(Aspect_GT_Rectangular, Aspect_GDM_Lines);
  aViewer->SetDefaultShadingModel(Graphic3d_TOSM_FRAGMENT);
  aViewer->SetDefaultLights();
  aViewer->SetLightOn();

  Handle(Aspect_NeutralWindow) aWindow = new Aspect_NeutralWindow();
  Graphic3d_Vec2i aWinSize = jsCanvasSize();
  if (aWinSize.x() < 10 || aWinSize.y() < 10)
  {
    Message::DefaultMessenger()->Send(TCollection_AsciiString("Warning: invalid canvas size"), Message_Warning);
  }
  aWindow->SetSize(aWinSize.x(), aWinSize.y());

  myTextStyle = new Prs3d_TextAspect();
  myTextStyle->SetFont(Font_NOF_ASCII_MONO);
  myTextStyle->SetHeight(12);
  myTextStyle->Aspect()->SetColor(Quantity_NOC_GRAY95);
  myTextStyle->Aspect()->SetColorSubTitle(Quantity_NOC_BLACK);
  myTextStyle->Aspect()->SetDisplayType(Aspect_TODT_SHADOW);
  myTextStyle->Aspect()->SetTextFontAspect(Font_FA_Bold);
  myTextStyle->Aspect()->SetTextZoomable(false);
  myTextStyle->SetHorizontalJustification(Graphic3d_HTA_LEFT);
  myTextStyle->SetVerticalJustification(Graphic3d_VTA_BOTTOM);

  myView = new V3d_View(aViewer);
  myView->SetImmediateUpdate(false);
  myView->ChangeRenderingParams().Resolution = (unsigned int)(96.0 * myDevicePixelRatio + 0.5);
#ifdef REACTCAD_DEBUG
  myView->ChangeRenderingParams().ToShowStats = true;
#endif
  myView->ChangeRenderingParams().StatsTextAspect = myTextStyle->Aspect();
  myView->ChangeRenderingParams().StatsTextHeight = (int)myTextStyle->Height();
  myView->SetWindow(aWindow);

#ifdef REACTCAD_DEBUG
  dumpGlInfo(false);
#endif

  myContext = new AIS_InteractiveContext(aViewer);
  initPixelScaleRatio();
  return true;
}

// ================================================================
// Function : initDemoScene
// Purpose  :
// ================================================================
void ReactCADView::initDemoScene()
{
  if (myContext.IsNull())
  {
    return;
  }

  // myView->TriedronDisplay (Aspect_TOTP_LEFT_LOWER, Quantity_NOC_GOLD, 0.08,
  // V3d_WIREFRAME);

  // presentation parameters
  initPixelScaleRatio();

  // Build with "--preload-file MySampleFile.brep" option to load some shapes
  // here.
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

// ================================================================
// Function : onResizeEvent
// Purpose  :
// ================================================================
EM_BOOL ReactCADView::onResizeEvent(int theEventType, const EmscriptenUiEvent *theEvent)
{
  (void)theEventType; // EMSCRIPTEN_EVENT_RESIZE or EMSCRIPTEN_EVENT_CANVASRESIZED
  (void)theEvent;
  if (myView.IsNull())
  {
    return EM_FALSE;
  }

  Handle(Aspect_NeutralWindow) aWindow = Handle(Aspect_NeutralWindow)::DownCast(myView->Window());
  Graphic3d_Vec2i aWinSizeOld, aWinSizeNew(jsCanvasSize());
  if (aWinSizeNew.x() < 10 || aWinSizeNew.y() < 10)
  {
    Message::DefaultMessenger()->Send(TCollection_AsciiString("Warning: invalid canvas size"), Message_Warning);
  }
  aWindow->Size(aWinSizeOld.x(), aWinSizeOld.y());
  const float aPixelRatio = jsDevicePixelRatio();
  if (aWinSizeNew != aWinSizeOld || aPixelRatio != myDevicePixelRatio)
  {
    if (myDevicePixelRatio != aPixelRatio)
    {
      myDevicePixelRatio = aPixelRatio;
      initPixelScaleRatio();
    }
    aWindow->SetSize(aWinSizeNew.x(), aWinSizeNew.y());
    myView->MustBeResized();
    myView->Invalidate();
    myView->Redraw();
    dumpGlInfo(true);
  }
  return EM_TRUE;
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
            myView->FitAll(0.01, false);
            myView->Invalidate();
          }
          else
          {
            myDoubleTapTimer.Stop();
            myDoubleTapTimer.Reset();
            myDoubleTapTimer.Start();
            SelectInViewer(Graphic3d_Vec2i(myClickTouch.From), false);
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

// ================================================================
// Function : onKeyDownEvent
// Purpose  :
// ================================================================
EM_BOOL ReactCADView::onKeyDownEvent(int theEventType, const EmscriptenKeyboardEvent *theEvent)
{
  if (myView.IsNull() || theEventType != EMSCRIPTEN_EVENT_KEYDOWN) // EMSCRIPTEN_EVENT_KEYPRESS
  {
    return EM_FALSE;
  }

  const double aTimeStamp = EventTime();
  const Aspect_VKey aVKey = WasmVKeys_VirtualKeyFromNative(theEvent->keyCode);
  if (aVKey == Aspect_VKey_UNKNOWN)
  {
    return EM_FALSE;
  }

  if (theEvent->repeat == EM_FALSE)
  {
    myKeys.KeyDown(aVKey, aTimeStamp);
  }

  if (Aspect_VKey2Modifier(aVKey) == 0)
  {
    // normal key
  }
  return EM_FALSE;
}

// ================================================================
// Function : onKeyUpEvent
// Purpose  :
// ================================================================
EM_BOOL ReactCADView::onKeyUpEvent(int theEventType, const EmscriptenKeyboardEvent *theEvent)
{
  if (myView.IsNull() || theEventType != EMSCRIPTEN_EVENT_KEYUP)
  {
    return EM_FALSE;
  }

  const double aTimeStamp = EventTime();
  const Aspect_VKey aVKey = WasmVKeys_VirtualKeyFromNative(theEvent->keyCode);
  if (aVKey == Aspect_VKey_UNKNOWN)
  {
    return EM_FALSE;
  }

  if (theEvent->repeat == EM_TRUE)
  {
    return EM_FALSE;
  }

  const unsigned int aModif = myKeys.Modifiers();
  myKeys.KeyUp(aVKey, aTimeStamp);
  if (Aspect_VKey2Modifier(aVKey) == 0)
  {
    // normal key released
    switch (aVKey | aModif)
    {
    case Aspect_VKey_F: {
      myView->FitAll(0.01, false);
      myView->Invalidate();
      updateView();
      return EM_TRUE;
    }
    }
  }
  return EM_FALSE;
}
