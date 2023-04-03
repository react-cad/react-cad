import React from "react";

const Box: React.FC = () => (
  <union>
    <helix height={10} pitch={10}>
      <planeSurface>
        <svg>
          <rect width={4} height={2} />
        </svg>
      </planeSurface>
    </helix>
    <prism z={3}>
      <planeSurface>
        <svg>
          <rect width={2} height={3} />
        </svg>
      </planeSurface>
    </prism>
  </union>
);

export default Box;
