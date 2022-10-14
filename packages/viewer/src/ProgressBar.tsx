import React from "react";

import type { ProgressIndicator } from "@react-cad/core";

interface Props {
  progressIndicator?: ProgressIndicator;
  queuedTasks: number;
}

const ProgressBar: React.FC<Props> = ({
  progressIndicator,
  queuedTasks,
  children,
}) => {
  const [progress, setProgress] = React.useState<number>(0);
  const [message, setMessage] = React.useState<string>();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (progressIndicator && !progressIndicator.isDeleted()) {
      const observer = (p: number, m?: string) => {
        setProgress(p);
        if (m) {
          setMessage(m);
        }
      };

      setShow(true);
      setProgress(0);
      setMessage("Waiting for renderer...");
      progressIndicator.subscribe(observer);
      progressIndicator.then(
        () => setShow(false),
        () => setMessage("Options changed, waiting for renderer...")
      );

      return () => {
        if (!progressIndicator.isDeleted()) {
          progressIndicator.unsubscribe(observer);
        }
      };
    }
  }, [progressIndicator]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {children}
      <div
        style={{
          zIndex: 1000,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          opacity: show ? 1 : 0,
          transition: show ? "" : "opacity 0.5s 0.5s",
        }}
      >
        <label style={{ display: "block" }}>
          <div
            style={{
              fontSize: "0.75rem",
              padding: "0.5rem",
              margin: "0 auto 0 0",
              display: "block",
              backgroundColor: "rgb(255,255,255,0.75)",
              width: "max-content",
              borderTopRightRadius: "4px",
            }}
          >
            {message}
            {queuedTasks
              ? ` (+ ${queuedTasks} task${
                  queuedTasks === 1 ? "" : "s"
                } in queue)`
              : null}
          </div>
          <progress
            css={{
              width: "100%",
              margin: 0,
              backgroundColor: "rgb(255,255,255,0.75)",
              height: 5,
              appearance: "none",
              border: "none",
              padding: 0,
              display: "block",
              "&::-webkit-progress-bar": {
                backgroundColor: "transparent",
              },
              "&::-webkit-progress-value": {
                backgroundColor: "rgb(30, 167, 253)",
              },
              "&::-moz-progress-bar": {
                backgroundColor: "rgb(30, 167, 253)",
              },
            }}
            max={1}
            value={progress}
          >
            {`${Math.floor(progress * 100)}%`}
          </progress>
        </label>
      </div>
    </div>
  );
};

export default ProgressBar;
