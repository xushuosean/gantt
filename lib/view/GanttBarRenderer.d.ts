import { GanttCellState } from "./GanttCellState";
import ganttShape from "../shape/ganttShape";
import GanttRectangleShape from '../shape/GanttRectangleShape';
export default class GanttBarRenderer {
    defaultShapes: Map<string, typeof ganttShape>;
    defaultShape: typeof GanttRectangleShape;
    constructor();
    redraw(state: GanttCellState): void;
    redrawShape(state: GanttCellState): void;
    initializeShape(state: GanttCellState): void;
    installListeners(state: GanttCellState): void;
    doRedrawShape(state: GanttCellState): void;
    createShape(state: GanttCellState): ganttShape;
    registerShape(key: string, shape: typeof ganttShape): void;
    getShapeConstructor(state: GanttCellState): typeof ganttShape | typeof GanttRectangleShape;
    getShape(name: string): typeof ganttShape | null | undefined;
}
