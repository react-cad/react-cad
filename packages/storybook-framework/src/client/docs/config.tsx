import React from "react";
import LazyLoad from "react-lazyload";
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
    <LazyLoad style={{ height: 480, overflow: "hidden", resize: "vertical" }}>
      {core ? <ReactCADViewer core={core} reset={true} {...props} /> : null}
    </LazyLoad>
  );
};

export const parameters = {
  docs: {
    inlineStories: true,
    prepareForInline: (
      storyFn: PartialStoryFn<any>,
      { id, parameters }: StoryContext<ReactCadFramework>
    ): React.ReactNode => {
      const { highDetail, lowDetail } = parameters.reactCad || {};

      return (
        <ViewContainer
          shape={storyFn()}
          name={id}
          highDetail={highDetail}
          lowDetail={lowDetail}
        />
      );
    },
    extractArgTypes,
    extractComponentDescription,
  },
};

export const argTypesEnhancers = [enhanceArgTypes];
