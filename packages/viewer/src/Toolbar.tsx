import React from "react";
import {
  TbZoomIn,
  TbZoomOut,
  TbZoomCancel,
  TbArrowBarToDown,
  TbArrowBarToUp,
  TbArrowBarToLeft,
  TbArrowBarToRight,
  TbArrowBackUp,
  TbSquare,
  TbPerspective,
  TbGizmo,
  TbFrame,
  TbBox,
  Tb3DCubeSphere,
  TbFileDownload,
} from "react-icons/tb";

import { Section, Button, Separator } from "./ui";

import { ViewOptions, Viewpoint } from "./types";

const ZOOM_AMOUNT = 50;

interface Props {
  options: ViewOptions;
  setOptions: (updater: (options: ViewOptions) => ViewOptions) => void;
  onDownload: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSetViewpoint: (viewpoint: Viewpoint) => void;
  onZoom: (amount: number) => void;
  onResetView: () => void;
  onFit: () => void;
  focus?: boolean;
  onResize?: () => void;
}

const Toolbar: React.FC<Props> = ({
  options,
  setOptions,
  onDownload,
  onSetViewpoint,
  onZoom,
  onResetView,
  onFit,
  focus,
  onResize,
  children,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (focus) {
      wrapperRef.current?.focus();
    }
  }, [focus]);

  React.useEffect(() => {
    if (onResize && wrapperRef.current) {
      const div = wrapperRef.current;
      let mounted = false;

      const observer = new ResizeObserver(() => {
        if (mounted) {
          onResize();
        }
        mounted = true;
      });
      observer.observe(div, {});

      return () => observer.disconnect();
    }
  }, [onResize]);

  const toggleShaded = React.useCallback(
    () =>
      setOptions((options) => ({
        ...options,
        showShaded: !options.showShaded,
        showWireframe: options.showWireframe || options.showShaded,
      })),
    []
  );
  const toggleWireframe = React.useCallback(
    () =>
      setOptions((options) => ({
        ...options,
        showWireframe: !options.showWireframe,
        showShaded: options.showShaded || options.showWireframe,
      })),
    []
  );

  const toggleAxes = React.useCallback(
    () =>
      setOptions((options) => ({ ...options, showAxes: !options.showAxes })),
    []
  );
  const toggleGrid = React.useCallback(
    () =>
      setOptions((options) => ({ ...options, showGrid: !options.showGrid })),
    []
  );
  const setProjection = (projection: ViewOptions["projection"]) =>
    React.useCallback(
      () => setOptions((options) => ({ ...options, projection })),
      []
    );

  const handleZoomIn = React.useCallback(() => onZoom(ZOOM_AMOUNT), []);
  const handleZoomOut = React.useCallback(() => onZoom(-ZOOM_AMOUNT), []);

  const handleSetViewpoint = (viewpoint: Viewpoint) =>
    React.useCallback(() => onSetViewpoint(viewpoint), []);

  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "+":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "=":
          onFit();
          break;
        case "p":
          setOptions((options) => ({
            ...options,
            projection:
              options.projection === "PERSPECTIVE"
                ? "ORTHOGRAPHIC"
                : "PERSPECTIVE",
          }));
          break;
        case "x":
          toggleAxes();
          break;
        case "g":
          toggleGrid();
          break;
        case "m":
          toggleShaded();
          break;
        case "w":
          toggleWireframe();
          break;
        case "r":
          onResetView();
          break;
      }
      if (event.shiftKey) {
        switch (event.code) {
          case "Digit8":
            onSetViewpoint("TOP");
            break;
          case "Digit2":
            onSetViewpoint("BOTTOM");
            break;
          case "Digit4":
            onSetViewpoint("LEFT");
            break;
          case "Digit6":
            onSetViewpoint("RIGHT");
            break;
          case "Digit1":
            onSetViewpoint("FRONT");
            break;
          case "Digit9":
            onSetViewpoint("BACK");
            break;
        }
      }
    },
    []
  );

  return (
    <div
      css={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        "&:focus": {
          outline: "rgba(30,167,253,0.5) solid 1px",
        },
        ...(onResize
          ? {
              resize: "both",
            }
          : {}),
      }}
      tabIndex={0}
      onKeyPress={handleKeyPress}
      ref={wrapperRef}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexGrow: 0,
          alignContent: "flex-start",
          border: "1px solid rgba(0,0,0,0.1)",
          padding: "2px 1px",
          writingMode: "vertical-lr",
        }}
      >
        <Section>
          <Button title="Zoom in (+)" onClick={handleZoomIn}>
            <TbZoomIn />
          </Button>
          <Button title="Zoom out (-)" onClick={handleZoomOut}>
            <TbZoomOut />
          </Button>
          <Button title="Zoom to fit (=)" onClick={onFit}>
            <TbZoomCancel />
          </Button>
          <Separator />
        </Section>
        <Section>
          <Button title="Top (Shift+8)" onClick={handleSetViewpoint("TOP")}>
            <TbArrowBarToDown />
          </Button>
          <Button
            title="Bottom (Shift+2)"
            onClick={handleSetViewpoint("BOTTOM")}
          >
            <TbArrowBarToUp />
          </Button>
          <Button title="Left (Shift+4)" onClick={handleSetViewpoint("LEFT")}>
            <TbArrowBarToRight style={{ transform: "rotate(45deg)" }} />
          </Button>
          <Button title="Right (Shift+6)" onClick={handleSetViewpoint("RIGHT")}>
            <TbArrowBarToLeft style={{ transform: "rotate(45deg)" }} />
          </Button>
          <Button title="Front (Shift+1)" onClick={handleSetViewpoint("FRONT")}>
            <TbArrowBarToUp style={{ transform: "rotate(45deg)" }} />
          </Button>
          <Button title="Back (Shift+9)" onClick={handleSetViewpoint("BACK")}>
            <TbArrowBarToDown style={{ transform: "rotate(45deg)" }} />
          </Button>
          <Button title="Reset view (R)" onClick={onResetView}>
            <TbArrowBackUp />
          </Button>
          <Separator />
        </Section>
        <Section>
          <Button
            active={options.projection === "ORTHOGRAPHIC"}
            title="Orthographic (P)"
            onClick={setProjection("ORTHOGRAPHIC")}
          >
            <TbSquare />
          </Button>
          <Button
            active={options.projection === "PERSPECTIVE"}
            title="Perspective (P)"
            onClick={setProjection("PERSPECTIVE")}
          >
            <TbPerspective />
          </Button>
          <Separator />
        </Section>
        <Section>
          <Button
            title="Show model (M)"
            onClick={toggleShaded}
            active={options.showShaded}
          >
            <TbBox />
          </Button>
          <Button
            title="Show wireframe (W)"
            onClick={toggleWireframe}
            active={options.showWireframe}
          >
            <Tb3DCubeSphere />
          </Button>
          <Separator />
        </Section>
        <Section>
          <Button
            title="Show axes (X)"
            onClick={toggleAxes}
            active={options.showAxes}
          >
            <TbGizmo />
          </Button>
          <Button
            title="Show grid (G)"
            onClick={toggleGrid}
            active={options.showGrid}
          >
            <TbFrame />
          </Button>
          <Separator />
        </Section>
        <Section>
          <Button title="Download as STL" onClick={onDownload}>
            <TbFileDownload />
          </Button>
        </Section>
      </div>
      <div style={{ flexGrow: 1 }}>{children}</div>
    </div>
  );
};

export default Toolbar;
