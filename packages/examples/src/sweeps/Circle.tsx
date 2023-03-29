import React from "react";

interface Props {
  vertices: number;
  radius?: number;
}

const Circle: React.FC<Props> = ({ vertices, radius = 5 }) => {
  const angles = [...Array(vertices)].map(
    (_, i) =>
      Math.PI / vertices + (((i + 1) % vertices) / vertices) * 2 * Math.PI
  );

  return (
    <svg viewBox="0 0 10 10">
      <path
        d={angles.reduce(
          (path, angle) =>
            `${path} A ${radius} ${radius} 0 ${vertices < 2 ? 1 : 0} 1 ${
              -Math.sin(angle) * radius
            } ${Math.cos(angle) * radius}`,
          `M ${-Math.sin(angles[vertices - 1]) * radius} ${
            Math.cos(angles[vertices - 1]) * radius
          }`
        )}
      />
    </svg>
  );
};

export default Circle;
