import React from "react";

const ReactIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle r="1.8" />
    <path d="M 10 0 A 10 5 0 1 1 -10 0 A 10 5 0 1 1 10 0 M 9 0 A 9 4 0 1 0 -9 0 A 9 4 0 1 0 9 0" />
    <g transform="rotate(60)">
      <path d="M 10 0 A 10 5 0 1 1 -10 0 A 10 5 0 1 1 10 0 M 9 0 A 9 4 0 1 0 -9 0 A 9 4 0 1 0 9 0" />
    </g>
    <g transform="rotate(120)">
      <path d="M 10 0 A 10 5 0 1 1 -10 0 A 10 5 0 1 1 10 0 M 9 0 A 9 4 0 1 0 -9 0 A 9 4 0 1 0 9 0" />
    </g>
  </svg>
);

export default ReactIcon;
