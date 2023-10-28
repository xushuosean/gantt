import Gantt from "../Gantt";
import GanttCell from "../model/GanttCell";
import GanttEventSource from "../util/GanttEventSource";
import { GanttMouseEvent } from "../util/GanttMouseEvent";
import GanttBarHandler from "./GanttBarHandler";
export declare class GanttSelectionCellsHandler extends GanttEventSource {
    constructor(gantt: Gantt);
    mouseDown(me: GanttMouseEvent): void;
    mouseMove(me: GanttMouseEvent): void;
    mouseUp(me: GanttMouseEvent): void;
    refresh(): void;
    handlers: Map<GanttCell, GanttBarHandler>;
    gantt: Gantt;
}
