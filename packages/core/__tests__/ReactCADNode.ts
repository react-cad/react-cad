import reactCadCore from "../lib";

describe("ReactCADNode", () => {
  it("should be a shape", async () => {
    const core = await reactCadCore();
    const box = core.createBoxNode();
    expect(box).toBeInstanceOf(core.ReactCADNode);
  });
});
