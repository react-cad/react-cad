import reactCadCore from "..";

describe("progress", () => {
  it("should indicate progress", async () => {
    const progressWatcher = jest.fn();
    const core = await reactCadCore();
    if (core.testProgress) {
      const progress = core.testProgress();
      progress.subscribe(progressWatcher);
      await progress;
      expect(progressWatcher).toHaveBeenCalledTimes(11);
      expect(progressWatcher).toHaveBeenNthCalledWith(6, 0.5);
      expect(progressWatcher).toHaveBeenLastCalledWith(1);
      progress.delete();
    }
  });
});
