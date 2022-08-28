/* eslint-disable no-param-reassign */
import React from "react";
import ReactDOM from "react-dom";
import {
  simulatePageLoad,
  simulateDOMContentLoaded,
} from "@storybook/preview-web";
import { RenderContext } from "@storybook/store";
import { ReactCadFramework } from "./types-6-0";
import ReactCadPreview from "@react-cad/preview";
import reactCadCoreWasm from "@react-cad/core/lib/react-cad-core.wasm";

const RemountHandler: React.FC<{
  shape: React.ReactElement;
  name?: string;
  forceRemount: boolean;
  id: string;
}> = ({ shape, forceRemount, id, name }) => {
  const [previousId, setPreviousId] = React.useState("");
  React.useEffect(() => setPreviousId(id), [id]);

  return (
    <ReactCadPreview
      coreUrl={reactCadCoreWasm}
      shape={shape}
      name={name}
      reset={forceRemount && id !== previousId}
    />
  );
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

  const Story = storyFn;

  ReactDOM.render(
    <RemountHandler
      forceRemount={forceRemount}
      id={id}
      shape={<Story />}
      name={name}
    />,
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
