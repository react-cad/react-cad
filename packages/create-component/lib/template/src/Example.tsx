import React from "react";

export interface Props {
  boxSize: number;
  sphereSize: number;
}

export const Example: React.FunctionComponent<Props> = ({ boxSize, sphereSize }) => (
  <difference>
    <sphere radius={sphereSize} />
    <box x={boxSize} y={boxSize} z={boxSize} center />
  </difference>
);

export default Example;
