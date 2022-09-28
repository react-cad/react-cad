import React from "react";
import ReactCADViewer from "@react-cad/viewer";
import {
  extractComponentDescription,
  enhanceArgTypes,
} from "@storybook/docs-tools";
import { PartialStoryFn, StoryContext } from "@storybook/csf";
import { jsxDecorator } from "@storybook/react/dist/esm/client/docs/jsxDecorator";
import { extractArgTypes } from "@storybook/react/dist/esm/client/docs/extractArgTypes";
import { ReactCadFramework } from "../preview/types-6-0";
import { useReactCADCore } from "../preview/hooks";

export const decorators = [jsxDecorator];
type ContainerProps = Omit<React.ComponentProps<typeof ReactCADViewer>, "core">;

const ViewContainer: React.FC<ContainerProps> = (props) => {
  const core = useReactCADCore();

  return (
    <div style={{ height: 480 }}>
      {core ? <ReactCADViewer core={core} reset={true} {...props} /> : null}
    </div>
  );
};

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline: (
      storyFn: PartialStoryFn<any>,
      { parameters }: StoryContext<ReactCadFramework>
    ): React.ReactNode => {
      const { highDetail, lowDetail, resizable = true } =
        parameters.reactCad || {};

      return (
        <ViewContainer
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
