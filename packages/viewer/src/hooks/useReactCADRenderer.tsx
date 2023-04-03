import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import type {
  ReactCADCore,
  ReactCADShape,
  ComputeError,
} from "@react-cad/core";
import { createRoot } from "@react-cad/renderer";
import { ViewOptions } from "../types";

import useConsoleError from "./useConsoleError";
import DetailContext from "../DetailContext";
import TaskManager from "../TaskManager";

const NullComponent = () => null;

function useReactCADRenderer(
  core: ReactCADCore,
  element: React.ReactElement | undefined,
  detail: ViewOptions["detail"]
): {
  taskManager: TaskManager;
  shape?: ReactCADShape;
  computeError?: ComputeError;
  renderError?: Error;
  renderErrorContext?: string;
} {
  const taskManager = React.useMemo(() => new TaskManager(core), [core]);
  const rootNode = React.useMemo(() => core.createCADNode("union"), [core]);
  const renderer = React.useMemo(() => createRoot(rootNode, core), [core]);

  const [shape, setShape] = React.useState<ReactCADShape>();
  const [computeError, setComputeError] = React.useState<ComputeError>();
  const [renderError, setRenderError] = React.useState<Error>();
  const [renderErrorContext, setRenderErrorContext] = React.useState<string>();

  React.useEffect(() => {
    const handlePrepare = () => {
      taskManager.cancelCompute();
      taskManager.cancelRender();

      setComputeError(undefined);
      setRenderError(undefined);
      setRenderErrorContext(undefined);
    };
    const handleCommit = () => {
      taskManager.compute(rootNode).then(setShape, setComputeError);
    };
    renderer.addEventListener("prepare", handlePrepare);
    renderer.addEventListener("commit", handleCommit);

    return () => {
      taskManager.cleanUpCurrentTask(true);
      renderer.removeEventListener("prepare", handlePrepare);
      renderer.removeEventListener("commit", handleCommit);
      renderer.delete();
      rootNode.delete();
    };
  }, [core]);

  useConsoleError((message) => {
    if (typeof message === "string" && message.startsWith("The above error")) {
      setRenderErrorContext(message);
    }
  });

  React.useEffect(() => {
    renderer.render(
      <ErrorBoundary
        FallbackComponent={NullComponent}
        onError={setRenderError}
        resetKeys={[element]}
      >
        <DetailContext.Provider value={detail}>
          {element}
        </DetailContext.Provider>
      </ErrorBoundary>
    );
  }, [element, detail, renderer]);

  return { taskManager, shape, computeError, renderError, renderErrorContext };
}

export default useReactCADRenderer;
