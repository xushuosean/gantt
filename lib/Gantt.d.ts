import { CodeToGantt } from './CodeToGantt';
import { GanttGeometry } from './model/GanttGeometry';
import GanttEventSource from './utils/GanttEventSource';
import GanttBarHandler from './handler/GanttBarHandler';
import GanttPopupHandler from './handler/GanttPopupHandler';
import GanttBarRenderer from './view/GanttBarRenderer';
import GanttHandler from './handler/GanttHandler';
import './gantt.css';
import GanttView from './view/GanttView';
import GanttModel from './model/GanttModel';
import GanttCell from './model/GanttCell';
import dayjs = require('dayjs');
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
    constructor(container: HTMLElement, tasks: GanttTask[], options: GanttOptions);
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
    fireMouseEvent(eventName: string, ...args: any[]): void;
    click(): void;
    getCellGeometry(cell: GanttCell): GanttGeometry | null;
    addBar(): void;
    createBarRenderer(): GanttBarRenderer;
    createHandlers(): void;
    createGanttHandler(): GanttHandler;
    createBarHandler(): GanttBarHandler;
    createPopupHandler(): GanttPopupHandler;
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
