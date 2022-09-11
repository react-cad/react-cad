import reactCadCore from "..";

describe("shape helpers", () => {
  describe("makeBox", () => {
    it("should be a shape", async () => {
      const core = await reactCadCore();
      const box = core.createCADNode("box");
      expect(box).toBeInstanceOf(core.ReactCADNode);
      box.delete();
    });
  });
});
