import { GanttCellState } from './GanttCellState';
import GanttEventSource from '../util/GanttEventSource';
import Gantt from '../Gantt';
import GanttCell from '../model/GanttCell';
import { GanttGeometry } from '../model/GanttGeometry';
export default class GanttView extends GanttEventSource {
    constructor(gantt: Gantt);
    init(): void;
    private isContainerEvent;
    private installListener;
    private createGElement;
    private tableView;
    createSvg(): void;
    getState(cell: GanttCell): GanttCellState | null;
    createState(cell: GanttCell): GanttCellState;
    invalidate(cell: GanttCell): void;
    validate(): void;
    private updateCellState;
    getDrawPane(): SVGGElement;
    getOverlayPane(): SVGGElement;
    gantt: Gantt;
    states: Map<GanttCell, GanttCellState>;
    ganttBounds: GanttGeometry;
    private canvas;
    private drawPane;
    private overlayPane;
}
