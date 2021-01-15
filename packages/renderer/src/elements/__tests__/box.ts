import { validateProps } from "../box";

describe("elements", () => {
  describe("box", () => {
    it("should validate props", () => {
      expect(() => validateProps({ x: 1, y: 1, z: 1 })).not.toThrow();

      expect(() =>
        // @ts-expect-error Testing incorrect props
        validateProps({ x: 1, y: 1 })
      ).toThrow();

      expect(() => validateProps({ x: 1, y: 1, z: -1 })).toThrow();

      expect(() => validateProps({ x: 1, y: 0, z: 1 })).toThrow();
    });
  });
});
