import { GanttGeometry } from "../model/GanttGeometry";
import GanttSvgCanvas from "../util/GanttSvgCanvas";
import ganttShape from "./ganttShape";

export default class GanttRectangleShape extends ganttShape {
  constructor(bounds: GanttGeometry, fillColor: string) {
    super();
    this.bounds = bounds;
    this.fillColor = fillColor;
  }

  override paintBackground(canvas: GanttSvgCanvas, x: number, y: number, width: number, height: number): void {
    canvas.rect(x, y, width, height, 4);
    canvas.end();
  }

  bounds: GanttGeometry;
}
