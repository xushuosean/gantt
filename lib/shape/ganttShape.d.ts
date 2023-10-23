import GanttSvgCanvas from "../util/GanttSvgCanvas";
import { GanttCellState } from "../view/GanttCellState";
export default class ganttShape {
    constructor();
    private initStyles;
    init(container: SVGGElement): void;
    create(container: any): SVGGElement;
    createSvg(): SVGGElement;
    redraw(): void;
    doRedrawShape(canvas: GanttSvgCanvas, x: number, y: number, w: number, h: number): void;
    createCanvas(): GanttSvgCanvas;
    apply(state: GanttCellState): void;
    destroy(): void;
    node: SVGGElement;
    bounds: any;
    strokewidth: number;
    opacity: number;
    state: GanttCellState;
}
