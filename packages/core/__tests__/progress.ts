import reactCadCore from "..";

describe("progress", () => {
  it("should return a promise", async () => {
    const core = await reactCadCore();
    const node = core.createCADNode("cylinder");
    const promise = core.computeNodeAsync(node);
    return promise.then(() => {
      node.delete();
      promise.delete();
    });
  });

  it("should indicate progress", async () => {
    const progressWatcher = jest.fn();
    const core = await reactCadCore();
    if (core.testProgress) {
      const progress = core.testProgress();
      progress.subscribe(progressWatcher);
      await progress;
      expect(progressWatcher).toHaveBeenCalledTimes(11);
      expect(progressWatcher).toHaveBeenNthCalledWith(6, 0.5, "Task");
      expect(progressWatcher).toHaveBeenLastCalledWith(1, "Task");
      progress.delete();
    }
  });
});
