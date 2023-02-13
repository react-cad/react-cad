import React from "react";
import type { ReactCADCore } from "@react-cad/core";

import jsUrl from "@react-cad/core/lib/react-cad-core";
import esmUrl from "@react-cad/core/lib/react-cad-core.esm";
import workerUrl from "@react-cad/core/lib/react-cad-core.worker";
import localWasmUrl from "@react-cad/core/lib/react-cad-core.wasm";

// Stop typescript and webpack messing with dynamic import
const importCore = Function(`return import("${esmUrl}")`) as () => Promise<
  typeof import("@react-cad/core")
>;

let core: ReactCADCore | undefined;

let corePromise: Promise<ReactCADCore> | undefined;

const loadCore = () =>
  importCore()
    .then(({ default: reactCadCore }) =>
      reactCadCore({
        mainScriptUrlOrBlob: jsUrl,
        locateFile: (path: string) =>
          path.includes("wasm")
            ? process.env.REACTCAD_WASM || localWasmUrl
            : workerUrl,
      })
    )
    .then((c) => {
      core = c;
      return c;
    });

export default function useReactCADCore(): ReactCADCore | undefined {
  const [loaded, setLoaded] = React.useState(false);

  if (!loaded) {
    if (!corePromise) {
      corePromise = loadCore();
    }
    corePromise.then(() => setLoaded(true));
  }

  return core;
}
