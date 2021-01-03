import _reactCadCore, { ReactCadEmscriptenModule, Shape } from "./react-cad-core";

export * from "./react-cad-core";

export type ReactCadCoreModule = Omit<ReactCadEmscriptenModule, "makeUnion"> & {
  makeUnion(shapes: Shape[]): Shape;
}

const reactCadCore: EmscriptenModuleFactory<ReactCadCoreModule> = async moduleOverrides => {
  const { makeUnion, ...overrides } = moduleOverrides ?? {};
  return _reactCadCore(overrides).then(core => ({
    ...core,
    makeUnion: (shapes: Shape[]) => {
      const nonNullShapes = shapes.filter(shape => !shape.IsNull());
      switch (nonNullShapes.length) {
        case 0:
          return new core.Shape();
        case 1:
          return core.copyShape(shapes[0]);
        default: {
          const shapeVector = new core.VectorShape();
          shapes.forEach(shape => shapeVector.push_back(shape));
          const shape = core.makeUnion(shapeVector);
          shapeVector.delete();
          return shape;
        }
      }
    },
  }));
};

export default reactCadCore;
