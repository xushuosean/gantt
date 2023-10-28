import { GanttUndoableEdit } from '../util/GanttUndoableEidt';
import GanttEventSource from "../util/GanttEventSource";
import GanttCell from "./GanttCell";
import GanttEvent from '../util/GanttEvent';
import GanttEventObject from '../util/GanttEventObject';
import { GanttGeometry } from './GanttGeometry';

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

export class mxGeometryChange {
  constructor(model: GanttModel, cell: GanttCell, geometry: GanttGeometry) {
    this.model = model;
    this.cell = cell;
    this.geometry = geometry;
    this.previous = geometry;
  }

  execute() {
    if (this.cell != null) {
      this.geometry = this.previous;
      this.previous = this.model.geometryForCellChanged(
        this.cell, this.previous)!;
    }
  };

  model: GanttModel;
  cell: GanttCell;
  geometry: GanttGeometry;
  previous: GanttGeometry
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
      const evt = new GanttEventObject(GanttEvent.CHANGE, 'edit', edit, 'chagnes', edit.changes)
      edit.source.fireEvent(evt)
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

  setGeometry(cell: GanttCell, geometry: GanttGeometry) {
    this.execute(new mxGeometryChange(this, cell, geometry));

    return geometry;
  }

  geometryForCellChanged(cell: GanttCell, geometry: GanttGeometry) {
    var previous = this.getGeometry(cell);
    cell.setGeometry(geometry);

    return previous;
  };

  private updateLevel: number = 0;
  private endingUpdate: boolean = false;
  private currentEdit: GanttUndoableEdit;
}
