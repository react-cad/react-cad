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
}

const Toolbar: React.FC<Props> = ({
  options,
  setOptions,
  onDownload,
  onSetViewpoint,
  onZoom,
  onResetView,
  onFit,
}) => {
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

  return (
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
        <Button title="Zoom in" onClick={handleZoomIn}>
          <TbZoomIn />
        </Button>
        <Button title="Zoom out" onClick={handleZoomOut}>
          <TbZoomOut />
        </Button>
        <Button title="Zoom to fit" onClick={onFit}>
          <TbZoomCancel />
        </Button>
        <Separator />
      </Section>
      <Section>
        <Button title="Top" onClick={handleSetViewpoint("TOP")}>
          <TbArrowBarToDown />
        </Button>
        <Button title="Bottom" onClick={handleSetViewpoint("BOTTOM")}>
          <TbArrowBarToUp />
        </Button>
        <Button title="Left" onClick={handleSetViewpoint("LEFT")}>
          <TbArrowBarToRight style={{ transform: "rotate(45deg)" }} />
        </Button>
        <Button title="Right" onClick={handleSetViewpoint("RIGHT")}>
          <TbArrowBarToLeft style={{ transform: "rotate(45deg)" }} />
        </Button>
        <Button title="Front" onClick={handleSetViewpoint("FRONT")}>
          <TbArrowBarToUp style={{ transform: "rotate(45deg)" }} />
        </Button>
        <Button title="Back" onClick={handleSetViewpoint("BACK")}>
          <TbArrowBarToDown style={{ transform: "rotate(45deg)" }} />
        </Button>
        <Button title="Reset view" onClick={onResetView}>
          <TbArrowBackUp />
        </Button>
        <Separator />
      </Section>
      <Section>
        <Button
          active={options.projection === "ORTHOGRAPHIC"}
          title="Orthographic"
          onClick={setProjection("ORTHOGRAPHIC")}
        >
          <TbSquare />
        </Button>
        <Button
          active={options.projection === "PERSPECTIVE"}
          title="Perspective"
          onClick={setProjection("PERSPECTIVE")}
        >
          <TbPerspective />
        </Button>
        <Separator />
      </Section>
      <Section>
        <Button
          title="Show shaded"
          onClick={toggleShaded}
          active={options.showShaded}
        >
          <TbBox />
        </Button>
        <Button
          title="Show wireframe"
          onClick={toggleWireframe}
          active={options.showWireframe}
        >
          <Tb3DCubeSphere />
        </Button>
        <Separator />
      </Section>
      <Section>
        <Button
          title="Show axes"
          onClick={toggleAxes}
          active={options.showAxes}
        >
          <TbGizmo />
        </Button>
        <Button
          title="Show grid"
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
  );
};

export default Toolbar;
