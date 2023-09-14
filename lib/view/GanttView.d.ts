import { GanttCellState } from './GanttCellState';
import GanttEventSource from '../utils/GanttEventSource';
import Gantt from '../Gantt';
import GanttCell from '../model/GanttCell';
import { GanttGeometry } from '../model/GanttGeometry';
export default class GanttView extends GanttEventSource {
    constructor(gantt: Gantt);
    init(): void;
    private installListener;
    private createGElement;
    createSvg(): void;
    getState(cell: GanttCell): GanttCellState | null;
    createState(cell: GanttCell): GanttCellState;
    invalidate(cell: GanttCell): void;
    validate(): void;
    private updateCellState;
    getDrawPane(): SVGGElement;
    gantt: Gantt;
    states: Map<GanttCell, GanttCellState>;
    ganttBounds: GanttGeometry;
    private canvas;
    private drawPane;
}
