type CanvasState = {
    fillColor: string | null;
    alpha: number;
    strokeColor: string | null;
    dashed: boolean;
    dashPattern: string;
    fixDash: boolean;
    strokeWidth: number;
    scale: number;
    strokeAlpha: number;
};
export default class GanttSvgCanvas {
    constructor(root: any);
    rect(x: number, y: number, width: number, height: number, rx?: number, paddingVertical?: number, paddingHorizontal?: number): void;
    ellipse(x: number, y: number, width: number, height: number): void;
    end(): void;
    addNode(filled: boolean, stroke: boolean): void;
    updateFill(): void;
    updateStroke(): void;
    format(value: any): number;
    getCurrentStrokeWidth(): number;
    createDashPattern(scale: number): string;
    createElement(tagName: string): HTMLElement;
    reset(): void;
    createState(): CanvasState;
    setFillColor(value: string): void;
    setStrokeColor(value: string): void;
    setStrokeWidth(vaule: number): void;
    setDashed(value: boolean, fixDash: boolean): void;
    setDashPattern(value: string): void;
    setAlpha(value: number): void;
    state: CanvasState;
    root: SVGElement;
    node: HTMLElement;
    minStrokeWidth: number;
}
export {};
