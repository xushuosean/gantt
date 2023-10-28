import Gantt from '../Gantt';
import { GanttMouseEvent } from '../util/GanttMouseEvent';
import { GanttCellState } from '../view/GanttCellState';
import { GanttGeometry } from '../model/GanttGeometry';
import BorderShape from '../shape/BorderShape';
import ganttShape from '../shape/ganttShape';
import GanttCell from '../model/GanttCell';
declare enum GanttBarHandle {
    left = 10,
    right = 11
}
export default class GanttBarHandler {
    state: GanttCellState;
    gantt: Gantt;
    selectionBorder: ganttShape;
    sizers: ganttShape[];
    preview: ganttShape;
    startX: number;
    startY: number;
    constructor(state: GanttCellState);
    init(): void;
    createSizer(cursor: string, i: number): BorderShape;
    createSizerShape(bounds: GanttGeometry, index: number): BorderShape;
    getSelectionBounds(state: GanttCellState): GanttGeometry;
    createSelectionShape(bounds: GanttGeometry): BorderShape;
    redraw(): void;
    drawPreview(): void;
    redrawHandles(): void;
    moveSizerTo(shape: ganttShape, x: number, y: number): void;
    start(x: number, y: number, index: GanttBarHandle): void;
    resizeVertex(me: GanttMouseEvent): void;
    getHandleForEvent(me: GanttMouseEvent): null;
    mouseDown(me: GanttMouseEvent): void;
    mouseMove(me: GanttMouseEvent): void;
    mouseUp(me: GanttMouseEvent): void;
    resizeCell(cell: GanttCell): void;
    reset(): void;
    destroy(): void;
    unscaledBounds: GanttGeometry | null;
    selectionBounds: GanttGeometry;
    bounds: GanttGeometry | null;
    index: number | null;
}
export {};
