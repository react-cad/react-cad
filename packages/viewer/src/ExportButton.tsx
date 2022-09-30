import React from "react";
import { TbFileDownload } from "react-icons/tb";
import { useClickOutside } from "./hooks";
import { ExportFns } from "./types";

import { Button, Dropdown, DropdownLink } from "./ui";

type Props = ExportFns;

const ExportButton: React.FC<Props> = ({
  exportSTL,
  exportBREP,
  exportSTEP,
}) => {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = React.useCallback(() => setOpen((o) => !o), []);
  const close = React.useCallback(() => setOpen(false), []);

  const handler = (exportFn: () => void) =>
    React.useCallback((event: React.SyntheticEvent) => {
      event.preventDefault();
      exportFn();
      close();
    }, []);

  const ref = useClickOutside(close);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <Button title="Export" onClick={toggleOpen}>
        <TbFileDownload />
      </Button>
      <Dropdown open={open}>
        <DropdownLink onClick={handler(exportBREP)}>
          Download as BREP
        </DropdownLink>
        <DropdownLink onClick={handler(exportSTEP)}>
          Download as STEP
        </DropdownLink>
        <DropdownLink onClick={handler(exportSTL)}>
          Download as STL
        </DropdownLink>
      </Dropdown>
    </div>
  );
};

export default ExportButton;
