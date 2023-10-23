import { createSVG } from "../util";
import GanttSvgCanvas from "../util/GanttSvgCanvas";
import { GanttCellState } from "../view/GanttCellState";

export default class ganttShape {
  constructor() {
    this.initStyles();
  }

  private initStyles() {
    this.strokewidth = 1;
    this.opacity = 100;
  }

  init(container: SVGGElement) {
    this.node = this.create(container)
    console

    if (container) {
      container.appendChild(this.node)
    }
  }

  create(container: any) {
    return this.createSvg();
  }

  createSvg() {
    return document.createElementNS('http://www.w3.org/2000/svg', 'g');
  }

  redraw() {
    const canvas = this.createCanvas();

    this.doRedrawShape(canvas, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

    this.node.insertAdjacentHTML('beforeend', canvas.root.outerHTML)
  }

  doRedrawShape(canvas: GanttSvgCanvas, x: number, y: number, w: number, h: number) {
    canvas.rect(x, y, w, h, 4, 4, 20);
    canvas.end()
  }

  createCanvas() {
    return new GanttSvgCanvas(this.node);
  }

  apply(state: GanttCellState) {
    this.state = state;
  }

  destroy() {
  }

  node: SVGGElement;

  bounds: any;
  strokewidth: number;
  opacity: number;

  state: GanttCellState;
}
