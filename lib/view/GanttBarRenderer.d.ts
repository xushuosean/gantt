import { GanttCellState } from "./GanttCellState";
import GanttShape from '../shape/ganttShape';
export default class GanttBarRenderer {
    defaultConfigShapes: {};
    defaultShape: any;
    constructor();
    redraw(state: GanttCellState): void;
    redrawShape(state: GanttCellState): void;
    initializeShape(state: GanttCellState): void;
    doRedrawShape(state: GanttCellState): void;
    createShape(state: GanttCellState): GanttShape;
    registerShape(key: string, shape: any): void;
}
