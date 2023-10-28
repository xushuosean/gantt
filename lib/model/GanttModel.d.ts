import { GanttUndoableEdit } from '../util/GanttUndoableEidt';
import GanttEventSource from "../util/GanttEventSource";
import GanttCell from "./GanttCell";
import { GanttGeometry } from './GanttGeometry';
export declare class GanttChildChange {
    model: GanttModel;
    cell: GanttCell;
    constructor(model: GanttModel, cell: GanttCell);
    execute(): void;
}
export declare class mxGeometryChange {
    constructor(model: GanttModel, cell: GanttCell, geometry: GanttGeometry);
    execute(): void;
    model: GanttModel;
    cell: GanttCell;
    geometry: GanttGeometry;
    previous: GanttGeometry;
}
export default class GanttModel extends GanttEventSource {
    cells: GanttCell[];
    constructor();
    add(cell: GanttCell): void;
    execute(change: any): void;
    createUndoableEdit(): GanttUndoableEdit;
    beginUpdate(): void;
    endUpdate(): void;
    getGeometry(cell: GanttCell): GanttGeometry | null;
    setGeometry(cell: GanttCell, geometry: GanttGeometry): GanttGeometry;
    geometryForCellChanged(cell: GanttCell, geometry: GanttGeometry): GanttGeometry | null;
    private updateLevel;
    private endingUpdate;
    private currentEdit;
}
