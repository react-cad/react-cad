export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        "Primitives",
        [
          "<box>",
          "<wedge>",
          "<cylinder>",
          "<cone>",
          "<sphere>",
          "<torus>",
          "<polyhedron>",
        ],
        "Sweeps",
        ["Prism", "Revolution", "Helix"],
        "Transformations",
        "Import",
        ["BREP", "STEP", "STL", "OBJ"],
        "Operations",
        ["Union", "Intersection", "Difference"],
        "Examples",
      ],
    },
  },
};
