import React from "react";

export const Label: React.FC = ({ children }) => (
  <span style={{ padding: "8px 4px", fontSize: 14 }}>{children}</span>
);

interface ButtonProps {
  title: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  active,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      css={{
        alignItems: "center",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        display: "inline-flex",
        fontSize: 18,
        fontWeight: "bold",
        height: 34,
        justifyContent: "center",
        margin: 2,
        padding: "8px 7px",
        writingMode: "horizontal-tb",
        "&:hover, &:focus-visible": {
          backgroundColor: "rgba(30,167,253,0.12)",
          color: "#1EA7FD",
        },
        "&:focus-visible": {
          outline: "auto", // Ensures links have the same focus style
        },
        "&:focus:not(:focus-visible)": {
          outline: "none",
        },

        ...(active
          ? {
              backgroundColor: "rgba(30,167,253,0.07)",
              color: "#1EA7FD",
            }
          : { backgroundColor: "transparent", color: "inherit" }),
      }}
    >
      {children}
    </button>
  );
};

export const Separator: React.FC = () => (
  <div
    css={{
      height: 1,
      width: 20,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      margin: 6,
    }}
  />
);

export const Section: React.FC = ({ children }) => (
  <div style={{ display: "flex", padding: "0 1px" }}>{children}</div>
);

export const Dropdown: React.FC<{ open: boolean }> = ({ open, children }) => (
  <div
    style={{
      position: "absolute",
      top: "-12px",
      left: "110%",
      display: open ? "inline-block" : "none",
      background: "rgba(255, 255, 255, 0.95)",
      filter:
        "drop-shadow(rgba(0, 0, 0, 0.05) 0px 5px 5px) drop-shadow(rgba(0, 0, 0, 0.1) 0px 1px 3px)",
      borderRadius: 8,
      fontSize: 12,
      writingMode: "horizontal-tb",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "calc(50% - 8px)",
        borderStyle: "solid",
        left: -16,
        borderWidth: "8px",
        borderColor:
          "transparent rgba(255, 255, 255, 0.95) transparent transparent",
      }}
    />
    <div
      style={{
        minWidth: 180,
        overflow: "hidden auto",
        maxHeight: 432,
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  </div>
);

export const DropdownLink: React.FC<JSX.IntrinsicElements["a"]> = ({
  onClick,
  children,
}) => (
  <a
    style={{
      fontSize: 12,
      transition: "all 150ms ease-out 0s",
      color: "rgba(51, 51, 51, 0.5)",
      textDecoration: "none",
      cursor: "pointer",
      justifyContent: "space-between",
      lineHeight: "18px",
      padding: "7px 15px",
      display: "flex",
      alignItems: "center",
    }}
    onClick={onClick}
  >
    <span
      style={{
        flex: "1 1 0%",
        textAlign: "left",
        color: "rgb(51, 51, 51)",
        fontWeight: 400,
      }}
    >
      {children}
    </span>
  </a>
);
