import { GanttCellState } from './../view/GanttCellState';

export class GanttMouseEvent {
  evt: MouseEvent;
  state: GanttCellState | null = null;
  sourcerState: GanttCellState;

  consumed: boolean = false;

  graphX: number;
  graphY: number;

  constructor(evt: MouseEvent, state?: GanttCellState) {
    this.evt = evt;
    if (state) {
      this.state = state;
      this.sourcerState = state;
    }
  }

  getEvent() {
    return this.evt;
  }

  getX() {
    return this.getEvent().clientX;
  }

  getY() {
    return this.getEvent().clientY;
  }

  isComsumed() {
    return this.consumed
  }

  consume(preventDefault?: boolean) {
    if (preventDefault && this.evt.preventDefault) {
      this.evt.preventDefault();
    }

    // Sets local consumed state
    this.consumed = true;
  }
}
