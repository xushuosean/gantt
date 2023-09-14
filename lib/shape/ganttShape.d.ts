import GanttSvgCanvas from "../utils/GanttSvgCanvas";
export default class ganttShape {
    constructor();
    private initStyles;
    init(container: SVGGElement): void;
    create(container: any): SVGGElement;
    createSvg(): SVGGElement;
    redraw(): void;
    doRedrawShape(canvas: GanttSvgCanvas, x: number, y: number, w: number, h: number): void;
    createCanvas(): GanttSvgCanvas;
    destroy(): void;
    node: SVGGElement;
    bounds: any;
    strokewidth: number;
    opacity: number;
}
