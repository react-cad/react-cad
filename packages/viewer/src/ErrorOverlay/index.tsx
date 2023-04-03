import React from "react";
import RedBox from "./RedBox";
import { ComputeError } from "@react-cad/core";

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
  computeError?: ComputeError;
  renderError?: Error;
  renderErrorContext?: string;
  showStackTrace?: boolean;
}

const RenderError: React.FC<Props> = ({
  computeError,
  renderError,
  renderErrorContext,
  showStackTrace = true,
}) => {
  const computeContext = React.useMemo(() => {
    if (!computeError) {
      return;
    }

    const computeParts = computeError.route
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

    const component = computeParts[computeParts.length - 1][1];

    return `The above error occured in the ${component} node:\n\n${computeParts.reduce(
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
  }, [computeError]);

  return (
    <>
      {(renderError || computeError) && (
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
              showStackTrace={showStackTrace}
            />
          )}
          {computeError && (
            <RedBox
              error={computeError}
              context={computeContext}
              showStackTrace={false}
            />
          )}
        </div>
      )}
    </>
  );
};

export default RenderError;
