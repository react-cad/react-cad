export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        "Primitives",
        ["Box", "Wedge", "Cylinder", "Cone", "Sphere", "Torus", "Polyhedron"],
        "Sweeps",
        ["Prism", "Revolution", "Helix"],
        "Transformations",
        "Import",
        ["STEP"],
        "Operations",
        ["Union", "Intersection", "Difference"],
        "Examples",
      ],
    },
  },
};
