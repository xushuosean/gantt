export class GanttGeometry {
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  clone() {
    return new GanttGeometry(this.x, this.y, this.width, this.height);
  }

  x: number;
  y: number;
  width: number;
  height: number;
}
