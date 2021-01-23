import reactCadCore from "..";

describe("ReactCADNode", () => {
  it("should be a shape", async () => {
    const core = await reactCadCore();
    const box = core.createCADNode("cylinder");
    expect(box).toBeInstanceOf(core.ReactCADNode);
  });
});
