import Gantt from "../Gantt";
import GanttCell from "../model/GanttCell";
import { GanttMouseEvent } from "../util/GanttMouseEvent";
export default class GanttHandler {
    constructor(gantt: Gantt);
    private selectEnabled;
    isSelectEnabled(): boolean;
    setSelectEnabled(value: boolean): void;
    private moveEnabled;
    isMoveEnabled(): boolean;
    setMoveEnabled(value: boolean): void;
    mouseDown(me: GanttMouseEvent): void;
    start(cell: GanttCell, x: number, y: number): void;
    mouseMove(): void;
    mouseUp(me: GanttMouseEvent): void;
    reset(): void;
    gantt: Gantt;
    cellWasClicked: boolean;
}
