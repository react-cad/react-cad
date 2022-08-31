export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        "Primitives",
        "Sweeps",
        ["Prism", "Revolution", "Helix"],
        "Transformations",
        "Operations",
        ["Union", "Intersection", "Difference"],
        "Examples",
      ],
    },
  },
};
