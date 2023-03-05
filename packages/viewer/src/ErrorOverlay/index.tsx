import React from "react";
import RedBox from "./RedBox";
import { GeometryError } from "@react-cad/core";

const nthNumber = (n: number) => {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

interface Props {
  geometryError?: GeometryError;
  renderError?: Error;
  renderErrorContext?: string;
}

const RenderError: React.FC<Props> = ({
  geometryError,
  renderError,
  renderErrorContext,
}) => {
  const geometryContext = React.useMemo(() => {
    if (!geometryError) {
      return;
    }

    const geometryParts = geometryError.route
      .split("/")
      .map(
        (p) =>
          p
            .split("-")
            .map((x, i) => (i ? x.toLowerCase() : Number.parseInt(x))) as [
            number,
            string
          ]
      );

    const component = geometryParts[geometryParts.length - 1][1];

    return `The above error occured in the ${component} node:\n\n${geometryParts.reduce(
      (acc, [index, name], idx) => {
        if (idx === 0) {
          return "";
        }
        if (idx === 1) {
          return name;
        }
        return `${name} - ${index + 1}${nthNumber(index + 1)} child of\n${acc}`;
      },
      ""
    )}`;
  }, [geometryError]);

  return (
    <>
      {(renderError || geometryError) && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
          }}
        >
          {renderError && (
            <RedBox
              error={renderError}
              context={
                renderErrorContext?.split(
                  "\nReact will try to recreate this"
                )[0]
              }
            />
          )}
          {geometryError && (
            <RedBox
              error={geometryError}
              context={geometryContext}
              showStackTrace={false}
            />
          )}
        </div>
      )}
    </>
  );
};

export default RenderError;
