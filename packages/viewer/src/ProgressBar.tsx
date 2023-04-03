import React from "react";

import TaskManager, {
  QueueEvent,
  ProgressEvent,
  StartEvent,
} from "./TaskManager";

interface Props {
  taskManager: TaskManager;
}

const ProgressBar: React.FC<Props> = ({ taskManager, children }) => {
  const [progress, setProgress] = React.useState<number>(0);
  const [message, setMessage] = React.useState<string>();
  const [show, setShow] = React.useState(false);
  const [queuedTasks, setQueuedTasks] = React.useState(0);

  const handleQueued = React.useCallback((event: Event) => {
    setQueuedTasks((event as QueueEvent).detail.queuedTasks);
  }, []);

  const handleStart = React.useCallback((event: Event) => {
    setShow(true);
    setProgress(0);
    setMessage(`Starting ${(event as StartEvent).detail.task}`);
  }, []);

  const handleProgress = React.useCallback((event: Event) => {
    const e = event as ProgressEvent;
    setShow(true);
    setProgress(e.detail.progress);
    if (e.detail.message) {
      setMessage(e.detail.message);
    }
    setQueuedTasks(e.detail.queuedTasks);
  }, []);

  const handleCancel = React.useCallback(() => {
    setShow(true);
    setProgress(0);
    setMessage("Cancelling...");
  }, []);

  const handleComplete = React.useCallback(() => {
    setShow(false);
  }, []);

  React.useEffect(() => {
    taskManager.addEventListener("progress", handleProgress);
    taskManager.addEventListener("cancel", handleCancel);
    taskManager.addEventListener("complete", handleComplete);
    taskManager.addEventListener("start", handleStart);
    taskManager.addEventListener("queued", handleQueued);

    return () => {
      taskManager.removeEventListener("progress", handleProgress);
      taskManager.removeEventListener("cancel", handleCancel);
      taskManager.removeEventListener("complete", handleComplete);
      taskManager.removeEventListener("start", handleStart);
      taskManager.removeEventListener("queued", handleQueued);
    };
  }, [taskManager]);

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
