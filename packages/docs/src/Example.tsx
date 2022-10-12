/** @jsxImportSource @emotion/react */
import React from "react";
import { SyntaxHighlighter } from "@storybook/components";
import { css } from "@storybook/theming";

interface Props {
  code: string;
  imgSrc: string;
}

const Example: React.FC<Props> = ({ code, imgSrc }) => (
  <div
    css={css`
      display: flex;
      align-items: center;
      border-radius: 4px;
      box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
      }
    `}
  >
    <div>
      <img
        src={imgSrc}
        css={css`
          display: block;
          width: 100%;
          height: auto;
          border-radius: 4px 0 0 4px;

          @media (max-width: 768px) {
            width: 100%;
            height: auto;
          }
        `}
      />
    </div>
    <div
      css={css`
        font-size: 0.875rem;
        padding: 0 0.5rem 0 1rem;
        flex-basis: 50%;

        @media (max-width: 768px) {
          padding: 1rem;
        }
      `}
    >
      <SyntaxHighlighter language="tsx">{code}</SyntaxHighlighter>
    </div>
  </div>
);

export default Example;
