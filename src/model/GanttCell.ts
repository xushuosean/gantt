import { GanttGeometry } from "./GanttGeometry";

export default class GanttCell {
  value: any;
  geometry: GanttGeometry;
  style: any;
  constructor(value: any, geometry: GanttGeometry, style: any) {
    this.value = value;
    this.geometry = geometry;
    this.style = style;

  }

  getGeometry(): GanttGeometry {
    return this.geometry;
  }

  setGeometry(geometry: GanttGeometry) {
    this.geometry = geometry;
  }

  id: string;
}
