/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@storybook/theming";
import LinkTo from "@storybook/addon-links/react";

interface Props {
  to: string;
}

const Link: React.FC<Props> = ({ to, children }) => (
  <LinkTo
    css={css`
      color: #1ea7fd;
      text-decoration: none;
      & code {
        color: #1ea7fd;
      }
    `}
    kind={to}
  >
    {children}
  </LinkTo>
);

export default Link;
