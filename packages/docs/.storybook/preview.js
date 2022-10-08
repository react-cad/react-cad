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
          "Imports",
          ["Introduction", "BREP", "STEP", "STL", "OBJ"],
          "Transformations",
          [
            "Introduction",
            "Translation",
            "Rotation",
            "Scale",
            "Mirror",
            "Affine",
          ],
          "Operations",
          ["Introduction", "Union", "Difference", "Intersection"],
        ],
      ],
    },
  },
};
