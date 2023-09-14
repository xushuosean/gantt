import { GanttCellState } from "./GanttCellState";
import GanttShape from '../shape/ganttShape';
import { GanttGeometry } from "../model/GanttGeometry";

export default class GanttBarRenderer {
  defaultConfigShapes: {};

  defaultShape: any = {};
  constructor() {
    this.defaultConfigShapes = {};
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

  createShape(state: GanttCellState): GanttShape {
    return new GanttShape();
  }

  registerShape(key: string, shape: any) {

  }
}
