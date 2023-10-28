import { GanttCellState } from './../view/GanttCellState';
export declare class GanttMouseEvent {
    evt: MouseEvent;
    state: GanttCellState | null;
    sourcerState: GanttCellState;
    consumed: boolean;
    graphX: number;
    graphY: number;
    constructor(evt: MouseEvent, state?: GanttCellState);
    getEvent(): MouseEvent;
    getX(): number;
    getY(): number;
    isComsumed(): boolean;
    consume(preventDefault?: boolean): void;
}
