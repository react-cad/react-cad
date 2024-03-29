import React from "react";
import opentype from "opentype.js/dist/opentype.module";
import roboto from "./Roboto-Regular.otffont";

const font = opentype.parse(roboto);

interface Props extends React.SVGProps<SVGSVGElement> {
  children: string;
}

const Text: React.FC<Props> = ({ children, ...props }) => {
  const svg = React.useMemo(() => font.getPath(children).toPathData(), [
    children,
  ]);
  return (
    <svg viewBox="0 0 1 1" {...props}>
      <g transform="scale(0.1 0.1) translate(0 27)">
        <path fill-rule="evenodd" d={svg} />
      </g>
    </svg>
  );
};

export default React.memo(Text);
