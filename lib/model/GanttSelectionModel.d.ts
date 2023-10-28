import Gantt from "../Gantt";
import GanttEventSource from "../util/GanttEventSource";
import GanttCell from "./GanttCell";
export declare class GanttSelectionModel extends GanttEventSource {
    constructor(gantt: Gantt);
    setCell(cell: GanttCell): void;
    setCells(cells: GanttCell[]): void;
    changeSelection(added: GanttCell[], removed: GanttCell[]): void;
    cellAdded(cell: GanttCell): void;
    clear(): void;
    cellRemoved(cell: GanttCell): void;
    cells: GanttCell[];
    gantt: Gantt;
}
