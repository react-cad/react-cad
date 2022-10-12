# @react-cad/core

Core ReactCAD WebAssembly library, providing primitives for constructing the shape tree and a viewer to render shape trees into an HTML canvas.

The viewer code is derived from the [Open CASCADE WebGL Sample application](https://dev.opencascade.org/doc/overview/html/occt_samples_webgl.html).

# Usage

```typescript
  import reactCadCore from "@react-cad/core";

  const core = await reactCadCore();
  const cube = core.createCADNode("box");
  cube.setSize([2, 2, 2]);

  core.renderSTEP(cube).then(contents => fs.writeFileSync("cube.step", contents));;
```

Use on the web requires more complex loading. See `@react-cad/storybook-framework` for a webpack example. One you have the core object:

```typescript
  const cube = core.createCADNode("box");
  cube.setSize([2, 2, 2]);

  const canvas = document.getElementById("my-canvas");
  const view = core.createView(canvas);

  core.renderNodeAsync(cube, view);
```

See [src/react-cad-core.d.ts](./src/react-cad-core.d.ts) for the TypeScript API.
