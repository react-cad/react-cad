import React from "react";
import type { ProgressIndicator } from "@react-cad/core";

export type Task = () => ProgressIndicator<any> | undefined;

export type AddTask = (task: Task, cancelPrevious?: boolean) => Promise<void>;

export type QueueItem = [Task, () => void];

function useProgressQueue(): [
  ProgressIndicator<any> | undefined,
  AddTask,
  number
] {
  const [progressIndicator, setProgressIndicator] = React.useState<
    ProgressIndicator<any>
  >();

  const queue = React.useRef<QueueItem[]>([]);

  const [queueLength, setQueueLength] = React.useState(0);

  const then = React.useCallback(() => {
    let progress: ProgressIndicator | undefined;
    let resolve: undefined | (() => void);

    do {
      const [task, r] = queue.current.shift() ?? [];
      progress = task?.();
      if (!progress) {
        r?.();
      } else {
        resolve = r;
      }
    } while (queue.current.length && !progress);

    setQueueLength(queue.current.length);

    progress?.then(then, () => {}).then(resolve);

    if (progress) {
      setProgressIndicator((p) => {
        p?.cancel();
        p?.delete();
        return progress;
      });
      progressRef.current = progress;
    }

    return progress;
  }, [queue]);

  const addTask = React.useCallback<AddTask>(
    (task, cancelPrevious = true) => {
      const queueItem: QueueItem = [task, () => {}];
      const promise = new Promise<void>((resolve) => (queueItem[1] = resolve));
      if (
        !progressIndicator ||
        progressIndicator.isDeleted() ||
        progressIndicator.isFulfilled()
      ) {
        queue.current.push(queueItem);
        then();
      } else {
        if (cancelPrevious) {
          queue.current.forEach(([, resolve]) => resolve());
          queue.current = [queueItem];
          progressIndicator.catch(then).catch(() => {});
          progressIndicator.cancel();
        } else {
          queue.current.push(queueItem);
          setQueueLength(queue.current.length);
        }
      }
      return promise;
    },
    [progressIndicator, then]
  );

  // Cancel last task on unmount
  const progressRef = React.useRef<ProgressIndicator>();
  React.useEffect(
    () => () => {
      if (progressRef.current && !progressRef.current.isDeleted()) {
        progressRef.current.cancel();
        progressRef.current.delete();
      }
    },
    []
  );

  return [progressIndicator, addTask, queueLength];
}

export default useProgressQueue;
