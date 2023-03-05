import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { ReactCADCore, ReactCADNode } from "@react-cad/core";
import { createRoot } from "@react-cad/renderer";
import { ViewOptions } from "../types";

import useConsoleError from "./useConsoleError";
import DetailContext from "../DetailContext";

const NullComponent = () => null;

function useReactCADRenderer(
  core: ReactCADCore,
  shape: React.ReactElement,
  detail: ViewOptions["detail"],
  reset?: boolean
): [ReactCADNode, number, boolean, Error | undefined, string | undefined] {
  const rootNode = React.useMemo(() => core.createCADNode("union"), [core]);
  const root = React.useMemo(() => createRoot(rootNode, core), [core]);

  const [renderFrameId, setRenderFrameId] = React.useState(0);
  const [renderReset, setRenderReset] = React.useState(false);
  const [renderError, setRenderError] = React.useState<Error>();
  const [renderErrorContext, setRenderErrorContext] = React.useState<string>();

  useConsoleError((message) => {
    if (message.startsWith("The above error")) {
      setRenderErrorContext(message);
    }
  });

  const renderCallback = React.useMemo(() => {
    let shouldReset = Boolean(reset);

    return async () => {
      setRenderReset(shouldReset);
      setRenderFrameId((n) => n + 1);

      shouldReset = false;
    };
  }, [core, rootNode, reset]);

  React.useEffect(() => {
    setRenderError(undefined);
    setRenderErrorContext(undefined);

    root.render(
      <ErrorBoundary
        FallbackComponent={NullComponent}
        onError={setRenderError}
        resetKeys={[shape]}
      >
        <DetailContext.Provider value={detail}>{shape}</DetailContext.Provider>
      </ErrorBoundary>,
      renderCallback
    );
  }, [shape, detail, root, rootNode]);

  React.useEffect(
    () => () => {
      root.delete();
      rootNode.delete();
    },
    []
  );

  return [
    rootNode,
    renderFrameId,
    renderReset,
    renderError,
    renderErrorContext,
  ];
}

export default useReactCADRenderer;
