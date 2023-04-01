import React from "react";

const Box: React.FC = () => (
  <union>
    <prism z={4}>
      <planeSurface>
        <svg>
          <rect width={2} height={1} />
        </svg>
      </planeSurface>
    </prism>
    <prism z={3}>
      <planeSurface>
        <svg>
          <rect width={1} height={2} />
        </svg>
      </planeSurface>
    </prism>
  </union>
);

export default Box;
