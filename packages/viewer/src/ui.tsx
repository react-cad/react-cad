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
