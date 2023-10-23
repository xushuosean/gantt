import { GanttUndoableEdit } from '../util/GanttUndoableEidt';
import GanttEventSource from "../util/GanttEventSource";
import GanttCell from "./GanttCell";
import GanttEvent from '../util/GanttEvent';

export class GanttChildChange {
  model: GanttModel;
  cell: GanttCell;

  constructor(
    model: GanttModel,
    cell: GanttCell
  ) {
    this.model = model;
    this.cell = cell;
  }

  execute() {

  }
}

export default class GanttModel extends GanttEventSource {
  cells: GanttCell[];
  constructor() {
    super();
    this.cells = []

    this.currentEdit = this.createUndoableEdit();
  }

  add(cell: GanttCell) {
    this.cells.push(cell)

    this.execute(new GanttChildChange(this, cell));
  }

  execute(change: any) {
    change.execute();
    this.beginUpdate();
    this.currentEdit.add(change)
    this.endUpdate();
  }

  createUndoableEdit() {
    const edit = new GanttUndoableEdit(this);

    edit.notify = function () {
      edit.source.fireEvent(GanttEvent.CHANGE, edit.changes)
    }

    return edit;
  }

  beginUpdate() {
    this.updateLevel++;
  }

  endUpdate() {
    this.updateLevel--;

    if (!this.endingUpdate) {
      this.endingUpdate = this.updateLevel === 0;

      try {
        if (this.endingUpdate && !this.currentEdit.isEmpty()) {
          const tmp = this.currentEdit;
          this.currentEdit = this.createUndoableEdit();
          tmp.notify();
        }
      }
      finally {
        this.endingUpdate = false;
      }
    }
  }

  getGeometry(cell: GanttCell) {
    return cell ? cell.getGeometry() : null;
  }

  private updateLevel: number = 0;
  private endingUpdate: boolean = false;
  private currentEdit: GanttUndoableEdit;
}
