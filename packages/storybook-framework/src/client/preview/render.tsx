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
import reactCadCoreWasm from "@react-cad/core/lib/react-cad-core.wasm";

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
  }: RenderContext<ReactCadFramework>,
  domElement: Element
): void {
  showMain();

  ReactDOM.render(
    <>
      <style>{`html, body, #root, .full-height-preview { height: 100% }`}</style>
      <RemountHandler forceRemount={forceRemount} id={id}>
        {(reset) => (
          <ReactCadViewer
            className="full-height-preview"
            coreUrl={reactCadCoreWasm}
            shape={storyFn()}
            name={name}
            reset={reset}
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
