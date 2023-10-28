import Gantt from "../Gantt";
import { GanttCellState } from "../view/GanttCellState";
export default class GanttEventFunc {
    static redirectMouseEvents(node: HTMLElement, gantt: Gantt, state: GanttCellState): void;
    static addGestureListeners(node: HTMLElement, startListener: any, moveListener: any, endListener: any): void;
}
