import Gantt from "../Gantt";
import { GanttCellState } from "../view/GanttCellState";
import GanttEvent from "./GanttEvent";
import { GanttMouseEvent } from "./GanttMouseEvent";

export default class GanttEventFunc {
  static redirectMouseEvents(node: HTMLElement, gantt: Gantt, state: GanttCellState) {
    GanttEventFunc.addGestureListeners(node,
      function (evt: MouseEvent) {
        gantt.fireMouseEvent(GanttEvent.MOUSEDOWN, new GanttMouseEvent(evt, state))
      },
      function (evt: MouseEvent) {
        gantt.fireMouseEvent(GanttEvent.MOUSEMOVE, new GanttMouseEvent(evt, state))
      },
      function (evt: MouseEvent) {
        gantt.fireMouseEvent(GanttEvent.MOUSEUP, new GanttMouseEvent(evt, state))
      }
    )
  }

  static addGestureListeners(node: HTMLElement, startListener, moveListener, endListener) {
    if (startListener != null) {
      node.addEventListener('mousedown', startListener);
    }

    if (moveListener != null) {
      node.addEventListener('mousemove', moveListener);
    }

    if (endListener != null) {
      node.addEventListener('mouseup', endListener);
    }
  }
}
