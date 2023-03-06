import React from "react";
import ReactCADViewerInternal from "./ReactCADViewer";
import { css, keyframes } from "@emotion/react";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface Props
  extends Omit<React.ComponentProps<typeof ReactCADViewerInternal>, "core"> {
  core?: React.ComponentProps<typeof ReactCADViewerInternal>["core"];
}

const ReactCADViewer: React.FC<Props> = ({ core, ...props }) => (
  <div
    css={css`
      background-color: #f0ffff;
      width: 100%;
      height: 100%;
      position: relative;
    `}
  >
    {core ? (
      <ReactCADViewerInternal core={core} {...props} />
    ) : (
      <div
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          border: 10px solid #ffbd21;
          border-top: 10px solid #e3a21c;
          border-radius: 50%;
          animation: ${spin} 1.5s linear infinite;
        `}
      />
    )}
  </div>
);
export default ReactCADViewer;

export { default as DetailContext } from "./DetailContext";
