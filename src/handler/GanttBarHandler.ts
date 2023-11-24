import Gantt from '../Gantt'
import GanttEventFunc from '../util/GanttEventFunc';
import { GanttMouseEvent } from '../util/GanttMouseEvent';
import { GanttCellState } from '../view/GanttCellState';
import { GanttGeometry } from '../model/GanttGeometry';
import BorderShape from '../shape/BorderShape';
import ganttShape from '../shape/ganttShape';
import GanttPoint from '../util/GanttPoint';
import GanttCell from '../model/GanttCell';
import { contains } from '../util/utils';

enum GanttBarHandle {
  left = 10,
  right
}

export default class GanttBarHandler {
  state: GanttCellState;
  gantt: Gantt;
  selectionBorder: ganttShape;

  sizers: ganttShape[] = [];

  preview: ganttShape;

  startX: number = 0;
  startY: number = 0;
  constructor(state: GanttCellState) {
    this.state = state;

    this.init();
  }

  init() {
    this.gantt = this.state.view.gantt;
    this.selectionBounds = this.getSelectionBounds(this.state)
    this.bounds = new GanttGeometry(this.selectionBounds.x, this.selectionBounds.y, this.selectionBounds.width, this.selectionBounds.height);
    this.selectionBorder = this.createSelectionShape(this.selectionBounds);

    this.selectionBorder.init(this.gantt.view.getOverlayPane());
    // this.selectionBorder.redraw()

    // Adds the sizer handles
    this.sizers = [];
    let i = 0;

    this.sizers.push(this.createSizer('w-resize', i++))
    this.sizers.push(this.createSizer('e-resize', i++))


    this.redraw();
  }

  createSizer(cursor: string, i: number) {
    const size = 6;

    const bounds = new GanttGeometry(0, 0, size, this.state.height);
    const sizer = this.createSizerShape(bounds, i);

    sizer.init(this.gantt.view.getOverlayPane())

    GanttEventFunc.redirectMouseEvents(sizer.node as unknown as HTMLElement, this.gantt, this.state)

    sizer.setCursor(cursor);

    return sizer;
  }

  createSizerShape(bounds: GanttGeometry, index: number) {
    return new BorderShape(bounds, '#fff', 'black')
  }

  getSelectionBounds(state: GanttCellState) {
    return new GanttGeometry(state.x, state.y, state.width, state.height);
  }

  createSelectionShape(bounds: GanttGeometry) {
    const shape = new BorderShape(bounds, '', '#00a8ff', 1)
    return shape;
  }

  redraw() {
    this.drawPreview();

    this.redrawHandles();
  }

  drawPreview() {
    if (this.preview) {
      this.preview.bounds = this.bounds;
      this.preview.redraw();
    }
    this.selectionBorder.bounds = this.bounds;
    this.selectionBorder.redraw()
  }

  redrawHandles() {
    const s = this.selectionBounds;

    const r = s.x + s.width;

    const cy = s.y + s.height / 2;

    this.moveSizerTo(this.sizers[0], s.x, cy);
    this.moveSizerTo(this.sizers[1], r, cy);
  }

  moveSizerTo(shape: ganttShape, x: number, y: number) {
    if (shape != null) {
      shape.bounds.x = Math.floor(x - shape.bounds.width / 2);
      shape.bounds.y = Math.floor(y - shape.bounds.height / 2);

      // Fixes visible inactive handles in VML
      if (shape.node != null && shape.node.style.display != 'none') {
        shape.redraw();
      }
    }
  }

  start(x: number, y: number, index: GanttBarHandle) {
    this.startX = x;
    this.startY = y;
    this.index = index;

    this.selectionBorder.node.style.display = 'none'

    this.preview = this.createSelectionShape(this.selectionBounds);
    this.preview.init(this.gantt.view.getOverlayPane());
  }

  union(bounds: GanttGeometry, dx: number, dy: number, index: number) {
    let w0 = bounds.width;
    let h0 = bounds.height;
    let left = bounds.x;
    let right = bounds.x + w0;

    // left handle
    if (index === 0) {
      left += dx;
      left = Math.round(left);
    } else if (index === 1) {
      // right handle
      right += dx;
      right = Math.round(right);
    }

    let width = right - left;

    // Flips over left side
    if (width < 0) {
      left += width;
      width = Math.abs(width);
    }

    const result = new GanttGeometry(left, bounds.y, width, h0);

    return result;
  }

  resizeVertex(me: GanttMouseEvent) {
    const point = new GanttPoint(me.graphX, me.graphY);

    const dx = point.x - this.startX;
    const dy = 0;

    const geo = this.gantt.getCellGeometry(this.state.cell)!;

    this.unscaledBounds = this.union(geo, dx, dy, this.index!);

    this.bounds = new GanttGeometry(this.unscaledBounds.x, this.unscaledBounds.y, this.unscaledBounds.width, this.unscaledBounds.height);

    if (this.preview) {
      this.drawPreview()
    }

  }

  getHandleForEvent(me: GanttMouseEvent) {
    const checkShape = (me: GanttMouseEvent, sizer: ganttShape) => {
      const x = me.graphX;
      const y = me.graphY;
      return contains(sizer.bounds, x, y)
    }
    let handle = null;
    this.sizers.forEach((sizer, index) => {
      if (checkShape(me, sizer)) {
        handle = index;
      }
    })

    return handle;
  }

  mouseDown(me: GanttMouseEvent) {
    if (!me.isComsumed()) {
      const handle = this.getHandleForEvent(me);
      if (handle !== null) {
        this.start(me.graphX, me.graphY, handle);
        me.consume();
      }
    }
  }

  mouseMove(me: GanttMouseEvent) {
    if (!me.isComsumed() && this.index != null) {
      this.resizeVertex(me)
    }
  }

  mouseUp(me: GanttMouseEvent) {
    console.log(this.index)
    if (this.index !== null && this.state !== null && !me.isComsumed()) {
      const index = this.index;
      this.index = null;
      const point = new GanttPoint(me.graphX, me.graphY);

      this.gantt.model.beginUpdate()
      try {
        const dx = point.x - this.startX;
        const dy = point.y - this.startY;

        this.resizeCell(this.state.cell);
      } finally {
        this.gantt.model.endUpdate();
      }

      me.consume();
      this.reset();
      this.redrawHandles();
    }
  }

  resizeCell(cell: GanttCell) {
    if (this.unscaledBounds) {
      this.gantt.resizeCell(cell, this.unscaledBounds)
    }
  }

  reset() {
    this.index = null;
    if (this.preview) {
      this.preview.destroy();
    }

    if (this.selectionBorder) {
      // todo: update new bounds
      this.selectionBorder.node.style.display = 'inline';
      this.selectionBounds = this.getSelectionBounds(this.state);
      this.bounds = new GanttGeometry(this.selectionBounds.x, this.selectionBounds.y,
        this.selectionBounds.width, this.selectionBounds.height);

      this.drawPreview();
    }

    this.unscaledBounds = null;
  }

  destroy() {
    if (this.selectionBorder) {
      this.selectionBorder.destroy();
    }

    if (this.preview) {
      this.preview.destroy();
    }

    if (this.sizers) {
      for (var i = 0; i < this.sizers.length; i++) {
        this.sizers[i].destroy();
      }
    }

  }

  unscaledBounds: GanttGeometry | null = null;
  selectionBounds: GanttGeometry;

  bounds: GanttGeometry | null = null;
  index: number | null = null;
}
