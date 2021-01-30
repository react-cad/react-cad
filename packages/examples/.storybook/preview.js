export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        "Primitives",
        "Sweeps",
        ["prism", "revolution", "helix"],
        "Transformations",
        "Operations",
        ["union", "intersection", "difference"],
        "Examples",
      ],
    },
  },
};
