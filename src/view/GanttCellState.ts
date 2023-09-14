import GanttCell from "../model/GanttCell";
import GanttView from "./GanttView";
import GanttShape from "../shape/ganttShape";

export class GanttCellState {
  view: GanttView;
  cell: GanttCell;

  shape: GanttShape | null = null;

  constructor(
    view: GanttView,
    cell: GanttCell
  ) {
    this.view = view;
    this.cell = cell;
  }

  x: number;
  y: number;
  width: number;
  height: number;

  invalid: boolean = false;
}
