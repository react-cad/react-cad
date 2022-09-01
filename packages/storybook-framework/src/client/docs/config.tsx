import React from "react";
import ReactCadViewer from "@react-cad/viewer";
import reactCadCoreJs from "@react-cad/core/lib/react-cad-core";
import reactCadCoreEsm from "@react-cad/core/lib/react-cad-core.esm";
import reactCadCoreWasm from "@react-cad/core/lib/react-cad-core.wasm";
import reactCadCoreWorker from "@react-cad/core/lib/react-cad-core.worker";
import {
  extractComponentDescription,
  enhanceArgTypes,
} from "@storybook/docs-tools";
import { PartialStoryFn, StoryContext } from "@storybook/csf";
import { jsxDecorator } from "@storybook/react/dist/esm/client/docs/jsxDecorator";
import { extractArgTypes } from "@storybook/react/dist/esm/client/docs/extractArgTypes";
import { ReactCadFramework } from "../preview/types-6-0";

export const decorators = [jsxDecorator];

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline: (
      storyFn: PartialStoryFn<any>,
      { parameters }: StoryContext<ReactCadFramework>
    ): React.ReactNode => {
      const {
        highDetail,
        lowDetail,
        resizable = true,
      } = parameters.reactCad || {};

      return (
        <ReactCadViewer
          coreUrl={reactCadCoreWasm}
          jsUrl={reactCadCoreJs}
          esmUrl={reactCadCoreEsm}
          workerUrl={reactCadCoreWorker}
          shape={storyFn()}
          highDetail={highDetail}
          lowDetail={lowDetail}
          resizable={resizable}
        />
      );
    },
    extractArgTypes,
    extractComponentDescription,
  },
};

export const argTypesEnhancers = [enhanceArgTypes];
