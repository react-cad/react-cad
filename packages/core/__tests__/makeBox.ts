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
  describe("step importer", () => {
    it("should create a node", async () => {
      const core = await reactCadCore();
      const step = core.createCADNode("step");
      expect(step).toBeInstanceOf(core.ReactCADNode);
      step.delete();
    });

    it("should accept step source", async () => {
      const core = await reactCadCore();
      const step = core.createCADNode("step");
      step.setSrc("source code");
      step.delete();
    });
  });
});
