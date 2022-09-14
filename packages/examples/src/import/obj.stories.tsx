import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import model from "./model.obj";

export type Props = JSX.IntrinsicElements["obj"];

interface StoryProps {
  files: string[];
}

export const Obj: React.FC<StoryProps> = ({ files }) => {
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

  return data ? <obj data={data} /> : null;
};

export default {
  title: "Import/Obj",
  component: Obj,
  argTypes: {
    files: {
      control: {
        type: "file",
        accept: "application/sla",
      },
    },
  },
} as Meta;

const Template: Story<StoryProps> = (args) => <Obj {...args} />;

export const obj = Template.bind({});
obj.args = {
  files: [model],
};
