export declare class GanttUndoableEdit {
    constructor(source: any);
    add(change: any): void;
    notify(): void;
    isEmpty(): boolean;
    changes: any[];
    source: any;
}
