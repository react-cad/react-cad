import React from "react";
import style from "./style";
import ErrorStackParser from "error-stack-parser";
import { isFilenameAbsolute, makeUrl, makeLinkText } from "./helpers";
import { mapStackTrace } from "sourcemapped-stacktrace";

const { redbox, message, stack, frame, file, linkToFile } = style;

interface RedBoxFramesProps {
  stack: Error["stack"];
  filename?: string;
  editorScheme?: string;
  useLines?: boolean;
  useColumns?: boolean;
}

const RedBoxFrames: React.FC<RedBoxFramesProps> = ({
  stack,
  filename,
  editorScheme,
  useLines = true,
  useColumns = true,
}) => {
  const frames = React.useMemo(() => {
    if (stack) {
      try {
        return ErrorStackParser.parse({ stack } as Error).map(
          ({ fileName, functionName, lineNumber, columnNumber }, index) => {
            let text;
            let url;

            if (index === 0 && filename && !isFilenameAbsolute(fileName)) {
              url = makeUrl(filename, editorScheme);
              text = makeLinkText(filename);
            } else {
              const lines = useLines ? lineNumber : undefined;
              const columns = useColumns ? columnNumber : undefined;
              url = makeUrl(fileName, editorScheme, lines, columns);
              text = makeLinkText(fileName, lines, columns);
            }

            return {
              functionName,
              url,
              text,
            };
          }
        );
      } catch (e) {
        return undefined;
      }
    }
  }, [stack]);

  return (
    <>
      {frames?.map(({ functionName, url, text }, index) => {
        return (
          <div style={frame} key={index}>
            <div>{functionName}</div>
            <div style={file}>
              <a href={url} style={linkToFile}>
                {text}
              </a>
            </div>
          </div>
        );
      })}
    </>
  );
};

const MemoisedFrames = React.memo(RedBoxFrames);

interface RedBoxProps {
  error: Error;
  context?: string;
  showStackTrace?: boolean;
  filename?: string;
  editorScheme?: string;
  useLines?: boolean;
  useColumns?: boolean;
}

const RedBox: React.FC<RedBoxProps> = ({
  error,
  filename,
  context,
  showStackTrace = true,
  editorScheme = "file",
  useLines = true,
  useColumns = true,
}) => {
  const [mappedStack, setMappedStack] = React.useState<Error["stack"]>();

  React.useEffect(() => {
    let cancelled = false;

    setMappedStack(undefined);

    if (!error.stack) {
      return;
    }

    const stackLines = error.stack.split("\n");

    // There's no stack, only the error message.
    if (!stackLines || stackLines.length < 2) {
      setMappedStack(error.stack);
    }

    // Using the “eval” setting on webpack already gives the correct location.
    const isWebpackEval = stackLines[1].search(/\(webpack:\/{3}/) !== -1;
    if (isWebpackEval) {
      // No changes are needed here.
      setMappedStack(error.stack);
    }

    // Other eval follow a specific pattern and can be easily parsed.
    const isEval = stackLines[1].search(/\(eval at/) !== -1;
    if (!isEval) {
      mapStackTrace(error.stack, (mappedStack) => {
        if (!cancelled) {
          setMappedStack(mappedStack.join("\n"));
        }
      });
      return () => {
        cancelled = true;
      };
    }

    // The first line is the error message.
    const fixedLines = [stackLines.shift()];
    // The rest needs to be fixed.
    for (const stackLine of stackLines) {
      const evalStackLine = stackLine.match(
        /(.+)\(eval at (.+) \(.+?\), .+(:[0-9]+:[0-9]+)\)/
      );
      if (evalStackLine) {
        const [, atSomething, file, rowColumn] = evalStackLine;
        fixedLines.push(`${atSomething} (${file}${rowColumn})`);
      } else {
        // TODO: When stack frames of different types are detected, try to load the additional source maps
        fixedLines.push(stackLine);
      }
    }

    setMappedStack(fixedLines.join("\n"));
  }, [error]);

  return (
    <>
      {error && (
        <div style={redbox}>
          <div style={message}>
            {error.name}: {error.message}
            {context && (
              <>
                <br />
                <br />
                {context}
              </>
            )}
          </div>
          {showStackTrace && mappedStack && (
            <div style={stack}>
              <MemoisedFrames
                stack={mappedStack}
                filename={filename}
                editorScheme={editorScheme}
                useLines={useLines}
                useColumns={useColumns}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RedBox;
