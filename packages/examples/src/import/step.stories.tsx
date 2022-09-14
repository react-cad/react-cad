import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import model from "./model.step";

export type Props = JSX.IntrinsicElements["step"];

interface StoryProps {
  files: string[];
}

export const Step: React.FC<StoryProps> = ({ files }) => {
  const [data, setData] = React.useState<ArrayBuffer>();
  React.useEffect(() => {
    if (!files.length) {
      return;
    }

    let cancelled = false;

    fetch(files[0])
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        if (!cancelled) {
          setData(buffer);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [files]);

  return data ? <step data={data} /> : null;
};

export default {
  title: "Import/STEP",
  component: Step,
  argTypes: {
    files: {
      control: {
        type: "file",
        accept: "application/STEP",
      },
    },
  },
} as Meta;

const Template: Story<StoryProps> = (args) => <Step {...args} />;

export const step = Template.bind({});
step.storyName = "STEP";
step.args = {
  files: [model],
};
