import Gantt from "../Gantt";
import GanttCell from "../model/GanttCell";
import { GanttMouseEvent } from "../util/GanttMouseEvent";

export default class GanttHandler {
  constructor(gantt: Gantt) {
    this.gantt = gantt;

    this.gantt.addMouseListener(this)
  }

  private selectEnabled = true;

  isSelectEnabled() {
    return this.selectEnabled;
  }

  setSelectEnabled(value: boolean) {
    this.selectEnabled = value;
  }

  private moveEnabled = true;

  isMoveEnabled() {
    return this.moveEnabled;
  }

  setMoveEnabled(value: boolean) {
    this.moveEnabled = value;
  }

  mouseDown(me: GanttMouseEvent) {
    if (!me.isComsumed() && me.state) {
      const cell = me.state.cell;
      console.log(cell)

      if (this.isSelectEnabled()) {
        this.gantt.setSelectionCell(cell)
      }

      if (this.isMoveEnabled()) {
        this.start(cell, me.getX(), me.getY());

        this.cellWasClicked = true;
        me.consume();
      }

    }

  }

  start(cell: GanttCell, x: number, y: number) { }


  mouseMove() { }
  mouseUp(me: GanttMouseEvent) {
    // if (!me.isComsumed() {

    // })
    if (this.cellWasClicked) {
      console.log('cell was click', me.getEvent())
      me.consume()
    }

    this.reset();
  }

  reset() {
    this.cellWasClicked = false;
  }

  gantt: Gantt;

  cellWasClicked: boolean = false;
}
