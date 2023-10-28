import { GanttGeometry } from "../model/GanttGeometry";
import GanttSvgCanvas from "../util/GanttSvgCanvas";
import ganttShape from "./ganttShape";
export default class GanttRectangleShape extends ganttShape {
    constructor(bounds: GanttGeometry, fillColor: string);
    paintBackground(canvas: GanttSvgCanvas, x: number, y: number, width: number, height: number): void;
    bounds: GanttGeometry;
}
