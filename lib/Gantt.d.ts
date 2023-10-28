import { GanttSelectionCellsHandler } from './handler/GanttSelectionCellsHandler';
import { GanttSelectionModel } from './model/GanttSelectionModel';
import { CodeToGantt } from './CodeToGantt';
import { GanttGeometry } from './model/GanttGeometry';
import GanttEventSource from './util/GanttEventSource';
import GanttBarHandler from './handler/GanttBarHandler';
import GanttPopupHandler from './handler/GanttPopupHandler';
import GanttBarRenderer from './view/GanttBarRenderer';
import GanttHandler from './handler/GanttHandler';
import './gantt.css';
import GanttView from './view/GanttView';
import GanttModel from './model/GanttModel';
import GanttCell from './model/GanttCell';
import dayjs = require('dayjs');
import { GanttMouseEvent } from './util/GanttMouseEvent';
import { GanttCellState } from './view/GanttCellState';
export interface IDisposable {
    dispose(): void;
}
export declare enum ViewMode {
    DAY = "Day",
    WEEK = "Week",
    MONTH = "Month",
    YEAR = "Year"
}
export type GanttTask = {
    id: string;
    start: string;
    end: string;
    name: string;
    value: any;
};
export type GanttOptions = {
    headerHeight: number;
    columnWidth: number;
    step: number;
    viewMode: ViewMode;
    barHeight: number;
    padding: number;
};
export default class Gantt extends GanttEventSource implements IDisposable {
    container: HTMLElement;
    root: SVGSVGElement;
    tasks: GanttTask[];
    options: GanttOptions;
    canvas: SVGGElement;
    tablePanel: SVGGElement;
    tableHeaderPanel: SVGGElement;
    tableBodyPanel: SVGGElement;
    tableBorderPanel: SVGGElement;
    barPanel: SVGGElement;
    barRenderer: GanttBarRenderer;
    view: GanttView;
    model: GanttModel;
    ganttHandler: GanttHandler;
    codeToGantt: CodeToGantt;
    selectionModel: GanttSelectionModel;
    selectionBarHandler: GanttSelectionCellsHandler;
    constructor(container: HTMLElement, tasks: GanttTask[], options: GanttOptions);
    setSelectionCell(cell: GanttCell): void;
    setSelectionCells(cells: GanttCell[]): void;
    sizeDidChange(): void;
    insertBar(id: string, value: any, x: number, y: number, width: number, height: number): void;
    autoCreateCell(): void;
    processChange(change: any): void;
    createGanttView(): GanttView;
    init(container: HTMLElement): void;
    addCell(cell: GanttCell): void;
    addCells(cells: GanttCell[]): void;
    mouseListeners: any[];
    addMouseListener(listener: any): void;
    intersects(state: GanttCellState, x: number, y: number): boolean;
    getCellAt(x: number, y: number): GanttCell | undefined;
    isMouseDown: boolean;
    updateMouseDown(me: GanttMouseEvent, eventName: string): void;
    fireMouseEvent(eventName: string, me: GanttMouseEvent): void;
    click(me: GanttMouseEvent): void;
    clearSelection(): void;
    getCellGeometry(cell: GanttCell): GanttGeometry | null;
    addBar(): void;
    createBarRenderer(): GanttBarRenderer;
    createHandlers(): void;
    createGanttHandler(): GanttHandler;
    createBarHandler(state: GanttCellState): GanttBarHandler;
    createSelectionBarHandler(): GanttSelectionCellsHandler;
    createPopupHandler(): GanttPopupHandler;
    resizeCell(cell: GanttCell, bounds: GanttGeometry): void;
    resizeCells(cells: GanttCell[], bounds: GanttGeometry[]): void;
    cellsResized(cells: GanttCell[], bounds: GanttGeometry[]): void;
    cellResized(cell: GanttCell, bounds: GanttGeometry): void;
    getSplitNumber(task: GanttTask): number;
    createGElement(): SVGGElement;
    setupOptions(): void;
    getRenderColumnWidth(): number;
    /** 获取 header 宽度 */
    getTableWidth(): number;
    get ganttStart(): dayjs.Dayjs;
    get ganttEnd(): dayjs.Dayjs;
    get diffMonth(): number;
    /** row 高度 */
    get rowHeight(): number;
    dispose(): void;
}
