import { GanttCellState } from "./GanttCellState";
import { GanttGeometry } from "../model/GanttGeometry";
import ganttShape from "../shape/ganttShape";
import GanttEvent from "../util/GanttEvent";
import { GanttMouseEvent } from "../util/GanttMouseEvent";
import GanttRectangleShape from '../shape/GanttRectangleShape';

export default class GanttBarRenderer {

  defaultShapes: Map<string, typeof ganttShape> = new Map();

  defaultShape = GanttRectangleShape;
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
      this.installListeners(state);

      state.shape.apply(state)

      state.shape.bounds = new GanttGeometry(state.x, state.y, state.width, state.height);
      this.doRedrawShape(state);
    }
  }

  initializeShape(state: GanttCellState) {
    state.shape?.init(state.view.getDrawPane())
  }

  installListeners(state: GanttCellState) {
    const gantt = state.view.gantt;
    state.shape?.node.addEventListener(GanttEvent.MOUSEDOWN, (evt) => {
      gantt.fireMouseEvent(GanttEvent.MOUSEDOWN, new GanttMouseEvent(evt, state));
    })
    state.shape?.node.addEventListener(GanttEvent.MOUSEMOVE, (evt) => {
      gantt.fireMouseEvent(GanttEvent.MOUSEMOVE, new GanttMouseEvent(evt, state));
    })
    state.shape?.node.addEventListener(GanttEvent.MOUSEUP, (evt) => {
      gantt.fireMouseEvent(GanttEvent.MOUSEUP, new GanttMouseEvent(evt, state));
    })
  }

  doRedrawShape(state: GanttCellState) {
    state.shape?.redraw()
  }

  createShape(state: GanttCellState): ganttShape {
    const ctor = this.getShapeConstructor(state);
    return new ctor(state.cell.geometry, '#ccc')
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
