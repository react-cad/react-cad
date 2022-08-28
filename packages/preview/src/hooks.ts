import React from "react";
import reactCadCore, { ReactCADCore } from "@react-cad/core";
import ReactCadRenderer from "@react-cad/renderer";

export function useReactCadCore(
  coreUrl: string
): [ReactCADCore | undefined, (canvas: HTMLCanvasElement | null) => void] {
  const [core, setCore] = React.useState<ReactCADCore>();

  const canvasRef = React.useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      reactCadCore({ canvas: canvas, locateFile: () => coreUrl }).then(setCore);
    } else {
      if (core) {
        ReactCadRenderer.destroyContainer(core);
        try {
          core._shutdown();
        } catch (e) {
          // Ignore emscripten exit message
        }
        setCore(undefined);
      }
    }
  }, []);

  return [core, canvasRef];
}

export function useReactCadRenderer(
  core: ReactCADCore | undefined,
  shape: React.ReactElement,
  reset?: boolean
): void {
  const [[latestShape, latestReset], setLatestShape] = React.useState([
    shape,
    reset,
  ]);
  React.useEffect(() => setLatestShape([shape, reset]), [shape]);

  const [
    renderedShape,
    setRenderedShape,
  ] = React.useState<React.ReactElement>();

  const [ready, setReady] = React.useState(true);

  React.useEffect(() => {
    if (core && ready && latestShape !== renderedShape) {
      setReady(false);
      setRenderedShape(latestShape);
      ReactCadRenderer.render(latestShape, core).then(() => {
        setReady(true);
        if (latestReset) {
          const view = core.getView();
          view.fit();
          view.delete();
        }
      });
    }
  }, [core, ready, latestShape, renderedShape]);
}
