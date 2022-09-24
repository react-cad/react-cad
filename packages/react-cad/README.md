# react-cad

A CAD system for producing constructive solid geometry using React.

## Usage

```javascript
import React from 'react';
import reactCadRenderer from "react-cad";

import reactCadCore from "@react-cad/core";

const canvas = document.getElementById("my-canvas");

const box = <box x={1} y={2} x={3} />;

reactCadCore({ canvas }).then(core => {
  reactCadRenderer.render(box, core);
  const updatedBox = <box x={4} y={5} x={6} />;
  reactCadRenderer.render(updatedBox, core);

  const stlString = reactCadRenderer.renderToSTL(updatedBox, core, 0.05, false, 0.5);
});
```

# Typescript

To get typechecking and code completion of @react-cad JSX elements, add `typeRoots` to your `tsconfig.json`:

```
{
  "compilerOptions": {
    "typeRoots": [
      "node_modules/@types",
      "node_modules/react-cad/types"
    ]
  }
}
```
