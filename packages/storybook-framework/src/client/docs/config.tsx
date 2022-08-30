import React from "react";
import ReactCadViewer from "@react-cad/viewer";
import reactCadCoreWasm from "@react-cad/core/lib/react-cad-core.wasm";
import {
  extractComponentDescription,
  enhanceArgTypes,
} from "@storybook/docs-tools";
import { PartialStoryFn } from "@storybook/csf";
import { jsxDecorator } from "@storybook/react/dist/esm/client/docs/jsxDecorator";
import { extractArgTypes } from "@storybook/react/dist/esm/client/docs/extractArgTypes";

export const decorators = [jsxDecorator];

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline: (storyFn: PartialStoryFn<any>): React.ReactNode => (
      <ReactCadViewer coreUrl={reactCadCoreWasm} shape={storyFn()} resizable />
    ),
    extractArgTypes,
    extractComponentDescription,
  },
};

export const argTypesEnhancers = [enhanceArgTypes];
