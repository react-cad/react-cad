# @react-cad/renderer

The custom React renderer which allows @react-cad projects to be written as React components.

## Usage

```javascript
import reactCadCore from "@react-cad/core";
import reactCadRenderer from "@react-cad/renderer";

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
      "node_modules/@react-cad/renderer/types"
    ]
  }
}
```
