import { GanttGeometry } from "./GanttGeometry";
export default class GanttCell {
    value: any;
    geometry: GanttGeometry;
    style: any;
    constructor(value: any, geometry: GanttGeometry, style: any);
    getGeometry(): GanttGeometry;
    setGeometry(geometry: GanttGeometry): void;
    id: string;
}
