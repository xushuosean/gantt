import { GanttUndoableEdit } from '../util/GanttUndoableEidt';
import GanttEventSource from "../util/GanttEventSource";
import GanttCell from "./GanttCell";
export declare class GanttChildChange {
    model: GanttModel;
    cell: GanttCell;
    constructor(model: GanttModel, cell: GanttCell);
    execute(): void;
}
export default class GanttModel extends GanttEventSource {
    cells: GanttCell[];
    constructor();
    add(cell: GanttCell): void;
    execute(change: any): void;
    createUndoableEdit(): GanttUndoableEdit;
    beginUpdate(): void;
    endUpdate(): void;
    getGeometry(cell: GanttCell): import("./GanttGeometry").GanttGeometry | null;
    private updateLevel;
    private endingUpdate;
    private currentEdit;
}
