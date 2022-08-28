import type { Args } from "@storybook/csf";

import type { StoryObj } from "./types-6-0";

export type { StoryFn, StoryObj, Meta } from "./types-6-0";

// NOTE these types are reversed from the way they are in types-6-0 and types-6-3

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<TArgs = Args> = StoryObj<TArgs>;
