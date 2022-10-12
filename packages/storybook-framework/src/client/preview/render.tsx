/* eslint-disable no-param-reassign */
import React from "react";
import ReactDOM from "react-dom";
import {
  simulatePageLoad,
  simulateDOMContentLoaded,
} from "@storybook/preview-web";
import { RenderContext } from "@storybook/store";
import { ReactCadFramework } from "./types-6-0";
import ReactCADViewer from "@react-cad/viewer";
import { useShouldReset, useReactCADCore } from "./hooks";

interface ContainerProps
  extends Omit<React.ComponentProps<typeof ReactCADViewer>, "core"> {
  forceRemount: boolean;
  id: string;
}
const ViewContainer: React.FC<ContainerProps> = ({
  forceRemount,
  id,
  children,
  ...props
}) => {
  const core = useReactCADCore();

  const shouldReset = useShouldReset(forceRemount, id, core);

  return core ? (
    <ReactCADViewer core={core} reset={shouldReset} {...props} />
  ) : null;
};

export function renderToDOM(
  {
    storyFn,
    showMain,
    forceRemount,
    id,
    storyContext,
  }: RenderContext<ReactCadFramework>,
  domElement: Element
): void {
  showMain();

  const { highDetail, lowDetail } = storyContext.parameters.reactCad || {};

  ReactDOM.render(
    <>
      <style>{`html, body, #root { height: 100%; padding: 0 !important; }`}</style>
      <ViewContainer
        forceRemount={forceRemount}
        id={id}
        shape={storyFn()}
        name={id}
        focus
        highDetail={highDetail}
        lowDetail={lowDetail}
        borderless
      />
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
