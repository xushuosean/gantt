export default class GanttSvgCanvas {
    constructor(root: any);
    rect(x: number, y: number, width: number, height: number): void;
    ellipse(x: number, y: number, width: number, height: number): void;
    end(): void;
    addNode(): void;
    createElement(tagName: string): HTMLElement;
    root: SVGElement;
    node: HTMLElement;
}
