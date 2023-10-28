export default class GanttEventObject {
    constructor(name: string, ...rest: any[]);
    getName(): string;
    getProperties(): any;
    getProperty(key: string): any;
    consume(): void;
    isConsumed(): boolean;
    name: string;
    properties: any;
    consumed: boolean;
}
