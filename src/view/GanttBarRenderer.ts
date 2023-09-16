import { GanttCellState } from "./GanttCellState";
import { GanttGeometry } from "../model/GanttGeometry";
import ganttShape from "../shape/ganttShape";

export default class GanttBarRenderer {

  defaultShapes: Map<string, typeof ganttShape> = new Map();

  defaultShape = ganttShape;
  constructor() {
  }

  redraw(state: GanttCellState) {
    this.redrawShape(state);
  }

  redrawShape(state: GanttCellState) {
    if (state.shape) {
      state.shape.destroy();
      state.shape = null;
    }

    if (state.shape === null) {
      state.shape = this.createShape(state);

      this.initializeShape(state);

      state.shape.apply(state)

      state.shape.bounds = new GanttGeometry(state.x, state.y, state.width, state.height);
      this.doRedrawShape(state);
    }
  }

  initializeShape(state: GanttCellState) {
    state.shape?.init(state.view.getDrawPane())
  }

  doRedrawShape(state: GanttCellState) {
    state.shape?.redraw()
  }

  createShape(state: GanttCellState): ganttShape {
    const ctor = this.getShapeConstructor(state);
    return new ctor()
  }

  registerShape(key: string, shape: typeof ganttShape) {
    this.defaultShapes.set(key, shape)
  }

  getShapeConstructor(state: GanttCellState) {
    const ctor = this.getShape('')
    if (!ctor) {
      return this.defaultShape
    }
    return ctor;
  }

  getShape(name: string) {
    return name ? this.defaultShapes.get(name) : null
  }
}
