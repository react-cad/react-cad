import { addons } from "@storybook/addons";
import { create } from "@storybook/theming";

const theme = create({
  base: "light",
  brandTitle: "ReactCAD",
  // brandImage: "TODO",
});

addons.setConfig({
  theme,
});
