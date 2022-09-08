import reactCadCore from "..";

describe("ReactCADNode", () => {
  it("should be a shape", async () => {
    const core = await reactCadCore();
    const node = core.createCADNode("cylinder");
    expect(node).toBeInstanceOf(core.ReactCADNode);
  });
});
