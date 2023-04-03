import type {
  ReactCADCore,
  ReactCADNode,
  ProgressIndicator,
  ReactCADView,
  ReactCADShape,
} from "@react-cad/core";

type Task = () => ProgressIndicator<any> | undefined;
type TaskType = "compute" | "render" | "export";

export type QueueEvent = CustomEvent<{ queuedTasks: number }>;
export type ProgressEvent = CustomEvent<{
  task: string;
  progress: number;
  message?: string;
  queuedTasks: number;
}>;
export type CompleteEvent = CustomEvent<{ task: string }>;
export type CancelEvent = CustomEvent<{ task: string }>;
export type StartEvent = CustomEvent<{ task: string }>;

class TaskManager extends EventTarget {
  core: ReactCADCore;

  currentProgress: ProgressIndicator | undefined;
  currentTask: TaskType | undefined;

  computeTask: Task | undefined;
  renderTask: Task | undefined;
  exportTasks: Task[] = [];

  constructor(core: ReactCADCore) {
    super();
    this.core = core;
  }

  queuedTasks(): number {
    return (
      this.exportTasks.length +
      (this.computeTask ? 1 : 0) +
      (this.renderTask ? 1 : 0)
    );
  }

  handleTaskQueued(): void {
    this.dispatchEvent(
      new CustomEvent("queued", {
        detail: {
          queuedTasks: this.queuedTasks(),
        },
      })
    );
  }

  handleProgress = (progress: number, name?: string): void => {
    const event = new CustomEvent("progress", {
      detail: {
        task: this.currentTask,
        progress,
        message: name,
        queuedTasks: this.queuedTasks(),
      },
    });
    this.dispatchEvent(event);
  };

  handleResolve = (): void => {
    if (this.currentTask) {
      this.dispatchEvent(
        new CustomEvent("complete", {
          detail: { task: this.currentTask },
        })
      );
    }
    this.cleanUpCurrentTask(false);
    this.startTask();
  };

  handleReject = (): void => {
    this.cleanUpCurrentTask(false);
    this.startTask();
  };

  cleanUpCurrentTask(cancel: boolean): void {
    if (this.currentProgress) {
      this.currentProgress.unsubscribe(this.handleProgress);
      if (cancel) {
        this.currentProgress.catch(() => {});
        this.currentProgress.cancel();
        this.dispatchEvent(
          new CustomEvent("cancel", {
            detail: { task: this.currentTask },
          })
        );
      }
      this.currentProgress.delete();
      this.currentProgress = undefined;
      this.currentTask = undefined;
    }
  }

  setCurrentTask(task: Task, taskType: TaskType): void {
    this.currentProgress = task();
    if (this.currentProgress) {
      this.currentProgress.then(this.handleResolve, this.handleReject);
      this.currentProgress.subscribe(this.handleProgress);
      this.currentTask = taskType;
      this.dispatchEvent(
        new CustomEvent("start", {
          detail: { task: this.currentTask },
        })
      );
    }
  }

  startTask(): void {
    if (this.currentProgress) {
      return;
    }
    if (this.exportTasks.length) {
      const task = this.exportTasks.shift()!;
      this.setCurrentTask(task, "export");
    } else if (this.computeTask) {
      const task = this.computeTask;
      this.computeTask = undefined;
      this.setCurrentTask(task, "compute");
    } else if (this.renderTask) {
      const task = this.renderTask;
      this.renderTask = undefined;
      this.setCurrentTask(task, "render");
    } else {
      return;
    }
    if (!this.currentProgress) {
      this.startTask();
    }
    this.handleTaskQueued();
  }

  compute(node: ReactCADNode): Promise<ReactCADShape> {
    this.cancelRender();
    this.cancelCompute();
    const promise = new Promise<ReactCADShape>((resolve, reject) => {
      this.computeTask = () => {
        if (!node.isDeleted()) {
          const progress = this.core.computeNode(node);
          progress.then(() => {
            !node.isDeleted() && resolve(node.getShape());
          }, reject);
          return progress;
        }
        reject("Node deleted before compute");
      };
    });
    this.startTask();
    this.handleTaskQueued();
    return promise;
  }

  render(shape: ReactCADShape, view: ReactCADView): Promise<void> {
    this.cancelRender();
    const promise = new Promise<void>((resolve, reject) => {
      this.renderTask = () => {
        if (!shape.isDeleted() && !view.isDeleted()) {
          const progress = this.core.renderShape(shape, view);
          progress.then(resolve, reject);
          return progress;
        }
        reject("Shape deleted before render");
      };
    });
    this.startTask();
    return promise;
  }

  exportBREP(shape: ReactCADShape): Promise<string | ArrayBuffer | undefined> {
    const promise = new Promise<string | ArrayBuffer | undefined>(
      (resolve, reject) => {
        this.exportTasks.push(() => {
          if (!shape.isDeleted()) {
            const progress = this.core.renderBREP(shape);
            progress.then(resolve, reject);
            return progress;
          }
          reject("Shape deleted before export");
        });
      }
    );
    this.startTask();
    return promise;
  }

  exportSTEP(shape: ReactCADShape): Promise<string | ArrayBuffer | undefined> {
    const promise = new Promise<string | ArrayBuffer | undefined>(
      (resolve, reject) => {
        this.exportTasks.push(() => {
          if (!shape.isDeleted()) {
            const progress = this.core.renderSTEP(shape);
            progress.then(resolve, reject);
            return progress;
          }
          reject("Shape deleted before export");
        });
      }
    );
    this.startTask();
    return promise;
  }

  exportSTL(
    shape: ReactCADShape,
    linearDeflection: number,
    angularDeflection: number
  ): Promise<string | ArrayBuffer | undefined> {
    const promise = new Promise<string | ArrayBuffer | undefined>(
      (resolve, reject) => {
        this.exportTasks.push(() => {
          if (!shape.isDeleted()) {
            const progress = this.core.renderSTL(
              shape,
              linearDeflection,
              angularDeflection
            );
            progress.then(resolve, reject);
            return progress;
          }
          reject("Shape deleted before export");
        });
      }
    );
    this.startTask();
    return promise;
  }

  cancelCompute(): void {
    if (this.currentTask == "compute") {
      this.cleanUpCurrentTask(true);
    }
    this.computeTask = undefined;
  }

  cancelRender(): void {
    if (this.currentTask == "render") {
      this.cleanUpCurrentTask(true);
    }
    this.renderTask = undefined;
  }
}

export default TaskManager;
