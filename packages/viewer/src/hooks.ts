import React from "react";
import reactCadCore, { ReactCADCore } from "@react-cad/core";
import ReactCadRenderer from "@react-cad/renderer";

export function useReactCadCore(
  coreUrl: string
): [
  React.MutableRefObject<ReactCADCore | undefined>,
  boolean,
  (canvas: HTMLCanvasElement | null) => void,
  () => void
] {
  const core = React.useRef<ReactCADCore>();
  const [loaded, setLoaded] = React.useState(false);
  const cancelled = React.useRef<boolean>(false);
  const [onResize, setOnResize] = React.useState(() => () => {});

  const canvasRef = React.useCallback((canvas: HTMLCanvasElement | null) => {
    function unload() {
      if (core.current) {
        ReactCadRenderer.destroyContainer(core.current);
        try {
          core.current._shutdown();
        } catch (e) {
          // Ignore emscripten exit message
        }
      }

      core.current = undefined;

      setLoaded(false);
    }

    if (canvas) {
      setLoaded(false);

      cancelled.current = false;

      reactCadCore({ canvas: canvas, locateFile: () => coreUrl }).then((c) => {
        core.current = c;

        if (cancelled.current) {
          unload();
        } else {
          canvas.width = canvas.clientWidth * window.devicePixelRatio;
          canvas.height = canvas.clientHeight * window.devicePixelRatio;

          setOnResize(() => () => {
            canvas.width = canvas.clientWidth * window.devicePixelRatio;
            canvas.height = canvas.clientHeight * window.devicePixelRatio;
            core.current?.onResize();
          });

          setLoaded(true);
        }
      });
    } else {
      cancelled.current = true;
      unload();
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  return [core, loaded, canvasRef, onResize];
}

export function useReactCadRenderer(
  core: React.MutableRefObject<ReactCADCore | undefined>,
  loaded: boolean,
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
    if (loaded && core.current && ready && latestShape !== renderedShape) {
      setReady(false);
      setRenderedShape(latestShape);
      ReactCadRenderer.render(latestShape, core.current).then(() => {
        setReady(true);
        if (latestReset) {
          core.current?.resetView();
        }
      });
    }
  }, [loaded, ready, latestShape, renderedShape]);

  React.useEffect(() => {
    if (loaded && core.current) {
      setReady(false);
      ReactCadRenderer.render(latestShape, core.current).then(() => {
        setReady(true);
        core.current?.resetView();
      });
    }
  }, [loaded]);
}
