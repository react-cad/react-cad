# @react-cad/core

Core @react-cad WebAssembly library, providing primitives for constructing the shape tree and a viewer to render shape trees into an HTML canvas.

The viewer code is derived from the [Open CASCADE WebGL Sample application](https://dev.opencascade.org/doc/overview/html/occt_samples_webgl.html).

# Usage

```typescript
  import reactCadCore from "@react-cad/core";

  const canvas = document.getElementById("my-canvas");

  reactCadCore({ canvas: canvas }).then((core) => {
    const cube = core.createCADNode("box");
    cube.setProps({ x: 2:, y: 2, z: 2 });
    core.render(cube, true);
  });
```

The JS module must be able to find the WebAssembly file at run time. You can provide a URI with the `locateFile` option:

```typescript
  import reactCadCore from "@react-cad/core";
  /* Get URL from webpack file-loader */
  import reactCadCoreWasmUrl from "file-loader!@react-cad/core/lib/react-cad-core.wasm";

  reactCadCore({ locateFile: () => reactCadCoreWasmUrl }).then((core) => {
    // ...
  });
```

See `src/main.cpp` for available node types and the relevant shape factory `.cpp` file for available props.
