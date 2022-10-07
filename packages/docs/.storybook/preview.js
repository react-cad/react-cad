export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        "Reference",
        [
          "Primitives",
          [
            "Introduction",
            "Box",
            "Sphere",
            "Cylinder",
            "Cone",
            "Torus",
            "Wedge",
            "Polyhedron",
          ],
          "Sweeps",
          ["Introduction", "Prism", "Helix", "Revolution", "Pipe", "Evolution"],
          "Transformations",
          "Import",
          ["BREP", "STEP", "STL", "OBJ"],
          "Operations",
          ["Union", "Intersection", "Difference"],
          "Examples",
        ],
      ],
    },
  },
};
