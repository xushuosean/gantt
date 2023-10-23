export default class GanttEventSource {
    constructor();
    eventListeners: any[];
    addListener(name: string, listener: any): void;
    removeListener(listener: any): void;
    fireEvent(name: string, ...args: any[]): void;
}
