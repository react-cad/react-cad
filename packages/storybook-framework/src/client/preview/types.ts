import { ReactElement } from "react";
export type { RenderContext } from "@storybook/core";

export type StoryFnReactCadReturnType = ReactElement;

export interface IStorybookStory {
  name: string;
  render: (context: any) => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}
