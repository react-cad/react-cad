import React from "react";
import ReactCADRenderer, { ReactCADCore } from "react-cad";
import { ViewOptions } from "./types";

import DetailContext from "./DetailContext";

export function useReactCadCore(
  coreUrl: string,
  jsUrl: string,
  esmUrl: string,
  workerUrl: string
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
        ReactCADRenderer.destroyContainer(core.current);
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
      cancelled.current = false;

      import(/* webpackIgnore: true */ `./${esmUrl}`).then(
        ({
          default: reactCadCore,
        }: {
          default: EmscriptenModuleFactory<ReactCADCore>;
        }) =>
          reactCadCore({
            canvas: canvas,
            mainScriptUrlOrBlob: jsUrl,
            locateFile: (path) => (path.includes("wasm") ? coreUrl : workerUrl),
          }).then((c) => {
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
          })
      );
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
  options: ViewOptions,
  reset?: boolean
): void {
  React.useEffect(() => {
    if (loaded && core.current) {
      core.current.showAxes(options.showAxes);
      core.current.showGrid(options.showGrid);
      core.current.showWireframe(options.showWireframe);
      core.current.showShaded(options.showShaded);
      core.current.setProjection(core.current.Projection[options.projection]);
    }
  }, [
    loaded,
    options.showAxes,
    options.showGrid,
    options.showShaded,
    options.showWireframe,
    options.projection,
  ]);

  React.useEffect(() => {
    if (loaded && core.current) {
      const quality =
        options.detail === "HIGH" ? options.highDetail : options.lowDetail;
      core.current.setQuality(...quality);
      ReactCADRenderer.render(
        <DetailContext.Provider value={options.detail}>
          {shape}
        </DetailContext.Provider>,
        core.current,
        !!reset
      );
    }
  }, [loaded, shape, options.detail, options.highDetail, options.lowDetail]);
}
