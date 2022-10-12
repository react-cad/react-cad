import React from "react";
import { css, keyframes } from "@storybook/theming";
import { TbFileDownload, TbRefresh } from "react-icons/tb";
import { useClickOutside } from "./hooks";
import { ExportFns } from "./types";

import { Button, Dropdown, DropdownLink } from "./ui";

function useClickHandler(fn: ExportFns[keyof ExportFns], close: () => void) {
  const [waiting, setWaiting] = React.useState(false);

  const handleClick = React.useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      if (!waiting) {
        setWaiting(true);
        fn().then(() => {
          setWaiting(false);
          close();
        });
      }
    },
    [waiting, fn, close]
  );

  return [handleClick, waiting] as const;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
`;

const Spinner: React.FC = () => (
  <TbRefresh
    css={css`
      animation: ${spin} 1s linear infinite;
    `}
  />
);

type Props = ExportFns;

const ExportButton: React.FC<Props> = ({
  exportSTL,
  exportBREP,
  exportSTEP,
}) => {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = React.useCallback(() => setOpen((o) => !o), []);
  const close = React.useCallback(() => setOpen(false), []);

  const [handleBREP, brepWaiting] = useClickHandler(exportBREP, close);
  const [handleSTEP, stepWaiting] = useClickHandler(exportSTEP, close);
  const [handleSTL, stlWaiting] = useClickHandler(exportSTL, close);

  const ref = useClickOutside(close);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <Button title="Export" onClick={toggleOpen}>
        <TbFileDownload />
      </Button>
      <Dropdown open={open}>
        <DropdownLink onClick={handleBREP}>
          Download as BREP {brepWaiting && <Spinner />}
        </DropdownLink>
        <DropdownLink onClick={handleSTEP}>
          Download as STEP {stepWaiting && <Spinner />}
        </DropdownLink>
        <DropdownLink onClick={handleSTL}>
          Download as STL {stlWaiting && <Spinner />}
        </DropdownLink>
      </Dropdown>
    </div>
  );
};

export default ExportButton;
