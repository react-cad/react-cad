import _reactCadCore, {
  ReactCadEmscriptenModule,
  Shape
} from "./react-cad-core";

export * from "./react-cad-core";

export type ReactCadCoreModule = Omit<
  ReactCadEmscriptenModule,
  "makeUnion" | "makeDifference" | "makeIntersection"
> & {
  makeUnion(shapes: Shape[]): Shape;
  makeDifference(shapes: Shape[]): Shape;
  makeIntersection(shapes: Shape[]): Shape;
};

const reactCadCore: EmscriptenModuleFactory<ReactCadCoreModule> = async moduleOverrides => {
  const { makeUnion, makeDifference, makeIntersection, ...overrides } =
    moduleOverrides ?? {};
  return _reactCadCore(overrides).then(core => ({
    ...core,
    makeUnion: (shapes: Shape[]) => {
      const nonNullShapes = shapes.filter(shape => !shape.IsNull());
      switch (nonNullShapes.length) {
        case 0:
          return new core.Shape();
        case 1:
          return core.copyShape(nonNullShapes[0]);
        default: {
          const shapeVector = new core.VectorShape();
          nonNullShapes.forEach(shape => shapeVector.push_back(shape));
          const shape = core.makeUnion(shapeVector);
          shapeVector.delete();
          return shape;
        }
      }
    },
    makeDifference: (shapes: Shape[]) => {
      if (shapes[0] && shapes[0].IsNull()) {
        return new core.Shape();
      }
      const nonNullShapes = shapes.filter(shape => !shape.IsNull());
      switch (nonNullShapes.length) {
        case 0:
          return new core.Shape();
        case 1:
          return core.copyShape(nonNullShapes[0]);
        default: {
          const shapeVector = new core.VectorShape();
          nonNullShapes.forEach(shape => shapeVector.push_back(shape));
          const shape = core.makeDifference(shapeVector);
          shapeVector.delete();
          return shape;
        }
      }
    },
    makeIntersection: (shapes: Shape[]) => {
      const nonNullShapes = shapes.filter(shape => !shape.IsNull());
      switch (nonNullShapes.length) {
        case 0:
          return new core.Shape();
        case 1:
          return core.copyShape(nonNullShapes[0]);
        default: {
          const shapeVector = new core.VectorShape();
          nonNullShapes.forEach(shape => shapeVector.push_back(shape));
          const shape = core.makeIntersection(shapeVector);
          shapeVector.delete();
          return shape;
        }
      }
    }
  }));
};

export default reactCadCore;
