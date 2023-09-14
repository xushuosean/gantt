import GanttCell from "../model/GanttCell";
import GanttView from "./GanttView";
import GanttShape from "../shape/ganttShape";
export declare class GanttCellState {
    view: GanttView;
    cell: GanttCell;
    shape: GanttShape | null;
    constructor(view: GanttView, cell: GanttCell);
    x: number;
    y: number;
    width: number;
    height: number;
    invalid: boolean;
}
