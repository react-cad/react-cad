import React from "react";
import { PrecisionContext } from "@react-cad/renderer";

interface Props extends React.SVGProps<SVGSVGElement> {
  sides: number;
  radius?: number;
  pointsPerVertex?: number;
}

const Polygon: React.FC<Props> = ({
  sides,
  radius = 5,
  pointsPerVertex = 1,
  ...props
}) => {
  const { approximation } = React.useContext(PrecisionContext);

  const angularPrecision = 2 * Math.asin(approximation / (2 * radius));

  const angles = [...Array(sides * pointsPerVertex)].map((_, i) => {
    const vertex = Math.floor(i / pointsPerVertex);
    const nthPerVertex = i % pointsPerVertex;
    return (
      Math.PI / sides +
      (vertex / sides) * 2 * Math.PI +
      nthPerVertex * angularPrecision
    );
  });

  const points = angles.reduce(
    (points, angle) =>
      `${points} ${-Math.sin(angle) * radius},${Math.cos(angle) * radius}`,
    ""
  );

  return (
    <svg viewBox="0 0 10 10" {...props}>
      <polygon points={points} />
    </svg>
  );
};

export default Polygon;
