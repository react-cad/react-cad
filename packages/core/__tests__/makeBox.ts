import reactCadCore from "../lib";

describe("shape helpers", () => {
  describe("makeBox", () => {
    it("should be a shape", async () => {
      const core = await reactCadCore();
      const box = core.makeBox(1, 2, 3);
      expect(box).toBeInstanceOf(core.Shape);
    });
  });
});
