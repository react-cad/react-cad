import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

const spine = `
  <svg>
    <circle r="5" />
  </svg>
`;

type Props = JSX.IntrinsicElements["evolution"];

const ErrorComponent: React.FC<Props> = (props) => (
  <union>
    <difference>
      <box x={1} y={1} z={1} />
      <evolution {...props} />
    </difference>
  </union>
);

export default {
  title: "Examples/Error",
  component: ErrorComponent,
} as Meta;

interface StoryProps {
  profile: string;
}

const Template: Story<StoryProps> = ({ profile }) => (
  <ErrorComponent spine={spine} profile={profile} />
);

export const error = Template.bind({});
error.args = {
  profile: "M 0 0 Q 0 ",
};

export const renderError = Template.bind({});
renderError.args = { profile: "" };
