import Gantt, { ViewMode } from "../Gantt";
import GanttEventSource from "../util/GanttEventSource";
export declare class TableView extends GanttEventSource {
    gantt: Gantt;
    mode: ViewMode;
    columnNum: number;
    columnWidth: number;
    headerHeight: number;
    container: SVGGElement;
    tableHeaderPanel: SVGGElement;
    tableBodyPanel: SVGGElement;
    tableBorderPanel: SVGGElement;
    constructor(gantt: Gantt, mode: ViewMode, columnNum: number, columnWidth: number, headerHeight: number);
    init(container: SVGGElement): void;
    createSvg(): void;
    renderTable(): void;
    updateGanttBounds(): void;
    redrawTableHeader(): void;
    /** row 高度 */
    get rowHeight(): number;
    redrawTableBody(): void;
    redrawTableBorder(): void;
    private createGElement;
    /** 获取 header 宽度 */
    private getTableWidth;
    private getTableHeight;
    private getRenderColumnWidth;
}
