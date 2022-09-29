import React from "react";
import { TbFileDownload } from "react-icons/tb";
import { useClickOutside } from "./hooks";
import { ExportFns } from "./types";

import { Button, Dropdown, DropdownLink } from "./ui";

type Props = ExportFns;

const ExportButton: React.FC<Props> = ({ exportSTL, exportBREP }) => {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = React.useCallback(() => setOpen((o) => !o), []);
  const close = React.useCallback(() => setOpen(false), []);

  const handleSTL = React.useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      exportSTL();
      close();
    },
    [exportSTL]
  );

  const handleBREP = React.useCallback(
    (event: React.SyntheticEvent) => {
      event?.preventDefault();
      exportBREP();
      close();
    },
    [exportBREP]
  );

  const ref = useClickOutside(close);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <Button title="Export" onClick={toggleOpen}>
        <TbFileDownload />
      </Button>
      <Dropdown open={open}>
        <DropdownLink onClick={handleBREP}>Download as BREP</DropdownLink>
        <DropdownLink onClick={handleSTL}>Download as STL</DropdownLink>
      </Dropdown>
    </div>
  );
};

export default ExportButton;
