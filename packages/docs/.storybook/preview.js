export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        "Home",
        "Getting started",
        "Writing components",
        "Publishing components",
        "Reference",
        [
          "Introduction",
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
            "Solid",
          ],
          "Constructions",
          [
            "Introduction",
            "Prism",
            "Revolution",
            "Pipe",
            "Helix",
            "Evolution",
            "Loft",
            "Solid",
          ],
          "Surfaces & SVGs",
          ["Introduction", "Planar", "Spherical", "Cylindrical"],
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
