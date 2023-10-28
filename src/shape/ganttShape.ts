import { createSVG } from "../util";
import GanttSvgCanvas from "../util/GanttSvgCanvas";
import { GanttCellState } from "../view/GanttCellState";

export default class ganttShape {
  constructor() {
    this.initStyles();
  }

  private initStyles() {
    this.strokeWidth = 1;
    this.opacity = 100;
  }

  init(container: SVGGElement) {
    this.node = this.create(container)

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
    this.clear();
    const canvas = this.createCanvas();

    this.doRedrawShape(canvas);

    this.node.insertAdjacentHTML('beforeend', canvas.root.outerHTML)
  }

  doRedrawShape(canvas: GanttSvgCanvas) {
    this.beforePaint(canvas);
    this.paint(canvas);
    this.afterPaint(canvas)
  }

  beforePaint(canvas: GanttSvgCanvas) { }

  paint(canvas: GanttSvgCanvas) {
    this.configureCanvas(canvas)
    this.paintShape(canvas, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height)
  }

  afterPaint(canvas: GanttSvgCanvas) { }

  paintShape(canvas: GanttSvgCanvas, x: number, y: number, width: number, height: number) {
    this.paintBackground(canvas, x, y, width, height);
    this.paintForeground(canvas, x, y, width, height);
  }

  paintBackground(canvas: GanttSvgCanvas, x: number, y: number, width: number, height: number) { }

  paintForeground(canvas: GanttSvgCanvas, x: number, y: number, width: number, height: number) { }

  configureCanvas(c: GanttSvgCanvas) {
    c.setFillColor(this.fillColor)
    c.setAlpha(this.opacity / 100)
    c.setDashed(true, true)
    c.setStrokeColor(this.stroke)
  }

  createCanvas() {
    return new GanttSvgCanvas(this.node);
  }

  apply(state: GanttCellState) {
    this.state = state;
  }

  destroy() {
    if (this.node.parentNode != null) {
      this.node.parentNode.removeChild(this.node);
    }
  }

  setCursor(cursor?: string) {
    if (cursor === undefined) {
      cursor = ''
    }

    this.cursor = cursor;

    if (this.node != null) {
      this.node.style.cursor = cursor;
    }
  }

  clear() {
    if (this.node.ownerSVGElement != null) {
      while (this.node.lastChild != null) {
        this.node.removeChild(this.node.lastChild);
      }
    }
    else {
      this.node.style.cssText = 'position:absolute;' + ((this.cursor != null) ?
        ('cursor:' + this.cursor + ';') : '');
      this.node.innerHTML = '';
    }
  }

  node: SVGGElement;

  bounds: any;
  stroke: string;
  strokeWidth: number;
  opacity: number;

  cursor: string;

  fillColor: string;

  state: GanttCellState;
}
