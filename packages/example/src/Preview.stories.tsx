import React from "react";
import { Story, Meta } from "@storybook/react";

import Preview from "./Preview";

export default {
  title: "Example/Preview",
  component: Preview,
} as Meta;

const Template: Story<{}> = args => <Preview {...args} />;

export const Default = Template.bind({});
Default.args = {
};
