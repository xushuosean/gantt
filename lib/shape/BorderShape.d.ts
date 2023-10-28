import { GanttGeometry } from "../model/GanttGeometry";
import GanttSvgCanvas from "../util/GanttSvgCanvas";
import ganttShape from "./ganttShape";
export default class BorderShape extends ganttShape {
    constructor(bounds: GanttGeometry, fillColor: string, stroke: string, strokeWidth?: number);
    paintBackground(canvas: GanttSvgCanvas, x: number, y: number, width: number, height: number): void;
    bounds: GanttGeometry;
}
