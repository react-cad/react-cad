import React from "react";
import ReactCadPreview from "./ReactCadPreview";

import { makeDecorator } from "@storybook/addons";

export const decorators = [
  makeDecorator({
    name: "withReactCadPreview",
    parameterName: "reactCadPreview",
    skipIfNoParametersOrOptions: false,
    wrapper: (storyFn, context) => (
      <ReactCadPreview shape={storyFn(context)} />
    )
  })
];
