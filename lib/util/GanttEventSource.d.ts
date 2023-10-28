import GanttEventObject from "./GanttEventObject";
export default class GanttEventSource {
    constructor();
    eventListeners: any[];
    addListener(name: string, listener: any): void;
    removeListener(listener: any): void;
    fireEvent(evt: GanttEventObject): void;
}
