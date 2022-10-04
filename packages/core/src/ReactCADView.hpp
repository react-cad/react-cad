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

#ifndef ReactCADView_HeaderFile
#define ReactCADView_HeaderFile

#include <map>
#include <memory>
#include <string>

#include <AIS_InteractiveContext.hxx>
#include <AIS_Shape.hxx>
#include <AIS_ViewController.hxx>
#include <Graphic3d_Camera.hxx>
#include <Message_ProgressRange.hxx>
#include <Message_ProgressScope.hxx>
#include <TopoDS_Shape.hxx>
#include <V3d_View.hxx>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5.h>
#include <emscripten/val.h>

#include "Trihedron.hpp"

//! Sample class creating 3D Viewer within Emscripten canvas.
class ReactCADView : public Standard_Transient, protected AIS_ViewController
{
public:
  ReactCADView(emscripten::val canvas);
  virtual ~ReactCADView();

  void render(TopoDS_Shape &shape, const Message_ProgressRange &theRange = Message_ProgressRange());

  enum Viewpoint
  {
    Top,
    Bottom,
    Left,
    Right,
    Front,
    Back
  };

  void setQuality(double deviationCoefficent, double angle,
                  const Message_ProgressRange &theRange = Message_ProgressRange());
  void setQualitySync(double deviationCoefficent, double angle);

  void setColor(std::string color);

  void zoom(double delta);
  void resetView();
  void fit();
  void setViewpoint(Viewpoint viewpoint);

  void setProjection(Graphic3d_Camera::Projection projection);

  void showAxes(bool show);
  void showGrid(bool show);

  void showWireframe(bool show);
  void showShaded(bool show);

  void onResize();

  //! Return interactive context.
  const Handle(AIS_InteractiveContext) & Context() const
  {
    return myContext;
  }

  //! Return view.
  const Handle(V3d_View) & View() const
  {
    return myView;
  }

private:
  //! Create window.
  void initWindow();

  //! Create 3D Viewer.
  bool initViewer();

  //! Application event loop.
  void mainloop();

  //! Flush events and redraw view.
  void redrawView();

  void drawShape(TopoDS_Shape &shape, const Message_ProgressRange &theRange);

  //! Request view redrawing.
  void updateView();

  //! Handle view redraw.
  virtual void handleViewRedraw(const Handle(AIS_InteractiveContext) & theCtx,
                                const Handle(V3d_View) & theView) override;

  //! Dump WebGL context information.
  void dumpGlInfo(bool theIsBasic);

  //! Initialize pixel scale ratio.
  void initPixelScaleRatio();

  //! Return point from logical units to backing store.
  Graphic3d_Vec2d convertPointToBacking(const Graphic3d_Vec2d &thePnt) const
  {
    return thePnt * myDevicePixelRatio;
  }

  //! Return point from logical units to backing store.
  Graphic3d_Vec2i convertPointToBacking(const Graphic3d_Vec2i &thePnt) const
  {
    Graphic3d_Vec2d aPnt = Graphic3d_Vec2d(thePnt) * myDevicePixelRatio + Graphic3d_Vec2d(0.5);
    return Graphic3d_Vec2i(aPnt);
  }

  //! @name Emscripten callbacks
private:
  //! Mouse event.
  EM_BOOL onMouseEvent(int theEventType, const EmscriptenMouseEvent *theEvent);

  //! Scroll event.
  EM_BOOL onWheelEvent(int theEventType, const EmscriptenWheelEvent *theEvent);

  //! Touch event.
  EM_BOOL onTouchEvent(int theEventType, const EmscriptenTouchEvent *theEvent);

  //! @name Emscripten callbacks (static functions)
private:
  static void onRedrawView(void *theView)
  {
    return ((ReactCADView *)theView)->redrawView();
  }

  static EM_BOOL onMouseCallback(int theEventType, const EmscriptenMouseEvent *theEvent, void *theView)
  {
    return ((ReactCADView *)theView)->onMouseEvent(theEventType, theEvent);
  }

  static EM_BOOL onWheelCallback(int theEventType, const EmscriptenWheelEvent *theEvent, void *theView)
  {
    return ((ReactCADView *)theView)->onWheelEvent(theEventType, theEvent);
  }

  static EM_BOOL onTouchCallback(int theEventType, const EmscriptenTouchEvent *theEvent, void *theView)
  {
    return ((ReactCADView *)theView)->onTouchEvent(theEventType, theEvent);
  }

private:
  std::string myId;
  EMSCRIPTEN_WEBGL_CONTEXT_HANDLE myWebglContext;
  Handle(AIS_InteractiveContext) myContext; //!< interactive context
  Handle(V3d_View) myView;                  //!< 3D view
  Handle(Prs3d_TextAspect) myTextStyle;     //!< text style for OSD elements
  Handle(Trihedron) myTrihedron;
  Aspect_Touch myClickTouch;     //!< single touch position for handling clicks
  OSD_Timer myDoubleTapTimer;    //!< timer for handling double tap
  float myDevicePixelRatio;      //!< device pixel ratio for handling high DPI displays
  unsigned int myUpdateRequests; //!< counter for unhandled update requests
  TopoDS_Shape myShape;
  Handle_AIS_Shape myShaded;
  Handle_AIS_Shape myWireframe;
  bool myShowShaded = true;
  bool myShowWireframe = true;
  bool myQualityChanged = false;
};

#endif // _ReactCADView_HeaderFile
