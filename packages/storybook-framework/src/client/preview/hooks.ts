import React from "react";
import type { ReactCADCore } from "@react-cad/core";

import jsUrl from "@react-cad/core/lib/react-cad-core";
import esmUrl from "@react-cad/core/lib/react-cad-core.esm";
import wasmUrl from "@react-cad/core/lib/react-cad-core.wasm";
import workerUrl from "@react-cad/core/lib/react-cad-core.worker";

// Stop typescript and webpack messing with dynamic import
const importCore = Function(`return import("./${esmUrl}")`) as () => Promise<
  typeof import("@react-cad/core")
>;

declare global {
  interface Window {
    core: ReactCADCore | undefined;
  }
}

const corePromise = Promise.resolve(
  window.core ??
    importCore()
      .then(({ default: reactCadCore }) => {
        return reactCadCore({
          mainScriptUrlOrBlob: jsUrl,
          locateFile: (path: string) =>
            path.includes("wasm") ? wasmUrl : workerUrl,
        });
      })
      .then((c) => {
        window.core = c;
        return c;
      })
);

export function useReactCADCore(): ReactCADCore | undefined {
  const [, setLoaded] = React.useState(false);
  corePromise.then(() => setLoaded(true));

  return window.core;
}

export function useShouldReset(
  forceRemount: boolean,
  id: string,
  core: ReactCADCore | undefined
): boolean {
  const [previousId, setPreviousId] = React.useState("");
  React.useEffect(() => setPreviousId(id), [id]);

  const [previousCore, setPreviousCore] = React.useState(core);
  React.useEffect(() => setPreviousCore(core), [core]);

  return (forceRemount && previousId !== id) || previousCore !== core;
}
