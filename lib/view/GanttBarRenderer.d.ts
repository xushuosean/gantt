import { GanttCellState } from "./GanttCellState";
import ganttShape from "../shape/ganttShape";
export default class GanttBarRenderer {
    defaultShapes: Map<string, typeof ganttShape>;
    defaultShape: typeof ganttShape;
    constructor();
    redraw(state: GanttCellState): void;
    redrawShape(state: GanttCellState): void;
    initializeShape(state: GanttCellState): void;
    doRedrawShape(state: GanttCellState): void;
    createShape(state: GanttCellState): ganttShape;
    registerShape(key: string, shape: typeof ganttShape): void;
    getShapeConstructor(state: GanttCellState): typeof ganttShape;
    getShape(name: string): typeof ganttShape | null | undefined;
}
