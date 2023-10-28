import Gantt from "../Gantt";
import GanttCell from "../model/GanttCell";
import GanttEvent from "../util/GanttEvent";
import GanttEventSource from "../util/GanttEventSource";
import { GanttMouseEvent } from "../util/GanttMouseEvent";
import GanttBarHandler from "./GanttBarHandler";

export class GanttSelectionCellsHandler extends GanttEventSource {
  constructor(gantt: Gantt) {
    super();
    this.gantt = gantt;

    this.gantt.addMouseListener(this)

    this.gantt.selectionModel.addListener(GanttEvent.CHANGE, this.refresh.bind(this));

  }

  mouseDown(me: GanttMouseEvent) {
    this.handlers.forEach(handler => {
      handler.mouseDown.apply(handler, [me])
    })
  }

  mouseMove(me: GanttMouseEvent) {
    this.handlers.forEach(handler => {
      handler.mouseMove.apply(handler, [me])
    })
  }

  mouseUp(me: GanttMouseEvent) {
    this.handlers.forEach(handler => {
      handler.mouseUp.apply(handler, [me])
    })
  }

  refresh() {
    const tmp = this.gantt.selectionModel.cells.slice();

    const oldHanlders = this.handlers;
    this.handlers = new Map();

    // destroy old handlers
    oldHanlders.forEach(handler => {
      handler.destroy();
    })

    // create new handlers
    for (let i = 0; i < tmp.length; i++) {
      const state = this.gantt.view.getState(tmp[i]);
      if (state) {
        let handler = this.handlers.get(tmp[i]);

        if (!handler) {
          handler = this.gantt.createBarHandler(state);
          this.handlers.set(tmp[i], handler);
        } else {
          console.log('has handler exists')
        }
      }
    }
  }

  handlers: Map<GanttCell, GanttBarHandler> = new Map();

  gantt: Gantt;
}
