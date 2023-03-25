import React from "react";

const Profile: React.FC<{ width: number; thickness: number }> = ({
  width,
  thickness,
}) => {
  const d = `M ${-width / 2} ${
    -thickness / 4
  } A ${thickness} ${thickness} 0 0 1 ${width / 2} ${-thickness / 4} L ${
    width / 2
  } ${thickness / 4} A ${thickness} ${thickness} 0 0 1 ${-width / 2} ${
    thickness / 4
  }  Z`;

  return (
    <planar>
      <svg width={width} height={thickness}>
        <path d={d} />
      </svg>
    </planar>
  );
};

const ScrewThread: React.FC<{ neckRadius: number; neckHeight: number }> = ({
  neckRadius,
  neckHeight,
}) => {
  const major = 2 * Math.PI * neckRadius;
  const minor = neckHeight / 10;
  const angle = (Math.atan(major / (neckHeight / 4)) * 180) / Math.PI;
  return (
    <rotation y={Math.PI / 2}>
      <loft compatible>
        <cylindrical radius={neckRadius * 0.99}>
          <svg viewBox="0 0 10 10">
            <g transform={`rotate(${angle})`}>
              <ellipse
                cx={0}
                cy={neckHeight / 2}
                rx={major * 0.99}
                ry={minor}
              />
            </g>
          </svg>
        </cylindrical>
        <cylindrical radius={neckRadius * 1.05}>
          <svg viewBox="0 0 10 10">
            <g transform={`rotate(${angle})`}>
              <ellipse
                cx={0}
                cy={neckHeight / 2}
                rx={major * 1.05}
                ry={minor / 4}
              />
            </g>
          </svg>
        </cylindrical>
      </loft>
    </rotation>
  );
};

export interface Props {
  height?: number;
  width?: number;
  thickness?: number;
}

const MakeBottle: React.FC<Props> = ({
  height = 70,
  width = 50,
  thickness = 30,
}) => (
  <union>
    <hollow
      thickness={-thickness / 50}
      boundingBox={[
        [-width, -thickness, -1],
        [width, thickness, height + height / 10 - 1],
      ]}
    >
      <fillet radius={thickness / 12}>
        <prism vector={[0, 0, height]}>
          <Profile width={width} thickness={thickness} />
        </prism>
      </fillet>
      <translation z={height}>
        <cylinder radius={thickness / 4} height={height / 10} />
      </translation>
    </hollow>
    <translation z={height}>
      <ScrewThread neckRadius={thickness / 4} neckHeight={height / 10} />
    </translation>
  </union>
);
export default MakeBottle;
