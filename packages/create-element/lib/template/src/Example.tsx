import React from "react";

export interface Props {
  boxSize: number;
  sphereSize: number;
}

const Example: React.FunctionComponent<Props> = ({ boxSize, sphereSize }) => (
  <difference>
    <sphere radius={sphereSize} />
    <translation x={-boxSize / 2} y={-boxSize / 2} z={-boxSize / 2}>
      <box x={boxSize} y={boxSize} z={boxSize} />
    </translation>
  </difference>
);

export default Example;
