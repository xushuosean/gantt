import Gantt from "../Gantt";
import GanttEvent from "../util/GanttEvent";
import GanttEventSource from "../util/GanttEventSource";
import GanttEventObject from '../util/GanttEventObject';
import GanttCell from "./GanttCell";

class GanttSelectionChange {
  constructor(selectionModel: GanttSelectionModel, added: GanttCell[], removed: GanttCell[]) {
    this.selectionModel = selectionModel;
    this.added = added ? added.slice() : [];
    this.removed = removed ? removed.slice() : [];
  }

  execute() {
    if (this.removed) {
      this.removed.forEach(cell => {
        this.selectionModel.cellRemoved(cell);
      })
    }

    if (this.added) {
      this.added.forEach(cell => {
        this.selectionModel.cellAdded(cell);
      })
    }

    console.log('added', this.added, 'removed', this.removed)

    this.selectionModel.fireEvent(new GanttEventObject(GanttEvent.CHANGE, 'added', this.added, 'removed', this.removed))
  }

  selectionModel: GanttSelectionModel;
  added: GanttCell[];
  removed: GanttCell[];
}

export class GanttSelectionModel extends GanttEventSource {
  constructor(gantt: Gantt) {
    super();
    this.gantt = gantt;
  }

  setCell(cell: GanttCell) {
    if (cell) {
      this.setCells([cell])
    }
  }

  setCells(cells: GanttCell[]) {
    this.changeSelection(cells, this.cells)
  }

  changeSelection(added: GanttCell[], removed: GanttCell[]) {
    const change = new GanttSelectionChange(this, added, removed);
    change.execute();
  }

  cellAdded(cell: GanttCell) {
    if (cell) {
      this.cells.push(cell)
    }
  }

  clear() {
    this.changeSelection([], this.cells);
  }

  cellRemoved(cell: GanttCell) {
    if (cell) {
      const index = this.cells.indexOf(cell);
      if (index >= 0) {
        this.cells.splice(index, 1);
      }
    }
  }

  cells: GanttCell[] = [];

  gantt: Gantt;
}
