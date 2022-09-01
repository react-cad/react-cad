/* eslint-disable no-param-reassign */
import React from "react";
import ReactDOM from "react-dom";
import {
  simulatePageLoad,
  simulateDOMContentLoaded,
} from "@storybook/preview-web";
import { RenderContext } from "@storybook/store";
import { ReactCadFramework } from "./types-6-0";
import ReactCadViewer from "@react-cad/viewer";
import reactCadCoreJs from "@react-cad/core/lib/react-cad-core";
import reactCadCoreEsm from "@react-cad/core/lib/react-cad-core.esm";
import reactCadCoreWasm from "@react-cad/core/lib/react-cad-core.wasm";
import reactCadCoreWorker from "@react-cad/core/lib/react-cad-core.worker";

const RemountHandler: React.FC<{
  forceRemount: boolean;
  id: string;
  children: (reset: boolean) => React.ReactElement;
}> = ({ forceRemount, id, children }) => {
  const [previousId, setPreviousId] = React.useState("");
  React.useEffect(() => setPreviousId(id), [id]);

  return children(forceRemount && id !== previousId);
};

export function renderToDOM(
  {
    storyFn,
    showMain,
    forceRemount,
    id,
    name,
    storyContext,
  }: RenderContext<ReactCadFramework>,
  domElement: Element
): void {
  showMain();

  const { highDetail, lowDetail, resizable } =
    storyContext.parameters.reactCad || {};

  ReactDOM.render(
    <>
      <style>{`html, body, #root, .full-height-preview { height: 100% }`}</style>
      <RemountHandler forceRemount={forceRemount} id={id}>
        {(reset) => (
          <ReactCadViewer
            className="full-height-preview"
            coreUrl={reactCadCoreWasm}
            jsUrl={reactCadCoreJs}
            esmUrl={reactCadCoreEsm}
            workerUrl={reactCadCoreWorker}
            shape={storyFn()}
            name={name}
            reset={reset}
            focus
            highDetail={highDetail}
            lowDetail={lowDetail}
            resizable={resizable}
          />
        )}
      </RemountHandler>
    </>,
    domElement,
    () => {
      if (forceRemount) {
        simulateDOMContentLoaded();
      } else {
        simulatePageLoad(domElement);
      }
    }
  );
}
