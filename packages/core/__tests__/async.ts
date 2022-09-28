import reactCadCore from "..";

describe("async", () => {
  it("should return a promise", async () => {
    const core = await reactCadCore();
    const node = core.createCADNode("cylinder");
    const promise = core.computeNodeAsync(node);
    return promise.then(() => node.delete());
  });
});
