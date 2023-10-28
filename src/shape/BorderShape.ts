import { GanttGeometry } from "../model/GanttGeometry";
import GanttSvgCanvas from "../util/GanttSvgCanvas";
import ganttShape from "./ganttShape";

export default class BorderShape extends ganttShape {
  constructor(bounds: GanttGeometry, fillColor: string, stroke: string, strokeWidth?: number) {
    super();
    this.bounds = bounds;
    this.fillColor = fillColor;
    this.stroke = stroke;
    if (strokeWidth !== undefined)
      this.strokeWidth = strokeWidth;
  }

  override paintBackground(canvas: GanttSvgCanvas, x: number, y: number, width: number, height: number): void {
    canvas.rect(x, y, width, height, 4, 0);
    canvas.end();
  }

  bounds: GanttGeometry;
}
