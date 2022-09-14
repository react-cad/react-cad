import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import model from "./model.stl";

export type Props = JSX.IntrinsicElements["stl"];

interface StoryProps {
  files: string[];
}

export const Stl: React.FC<StoryProps> = ({ files }) => {
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

  return data ? <stl data={data} /> : null;
};

export default {
  title: "Import/STL",
  component: Stl,
  argTypes: {
    files: {
      control: {
        type: "file",
        accept: "application/sla",
      },
    },
  },
} as Meta;

const Template: Story<StoryProps> = (args) => <Stl {...args} />;

export const stl = Template.bind({});
stl.storyName = "STL";
stl.args = {
  files: [model],
};
