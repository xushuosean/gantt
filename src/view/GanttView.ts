import { GanttMouseEvent } from './../util/GanttMouseEvent';
import { GanttCellState } from './GanttCellState';
import { TableView } from './TableView';
import GanttEventSource from '../util/GanttEventSource'
import Gantt from '../Gantt';
import GanttEvent from '../util/GanttEvent';
import GanttCell from '../model/GanttCell';
import { GanttGeometry } from '../model/GanttGeometry';

export default class GanttView extends GanttEventSource {
  constructor(gantt: Gantt) {
    super();
    this.gantt = gantt;

    this.states = new Map<GanttCell, GanttCellState>();
  }

  init() {
    this.installListener();

    this.createSvg();
  }

  private isContainerEvent(evt: MouseEvent) {
    const source = evt.srcElement ? evt.srcElement : evt.target;

    const containerElement = [
      this.gantt.container,
    ]

    const sourceParnet = source.parentNode;
    return containerElement.some(element => element === source) || [this.tableView.tableBodyPanel].some(ele => ele === sourceParnet)
  }

  private installListener() {
    const container = this.gantt.container;
    const gantt = this.gantt;

    container.addEventListener(GanttEvent.MOUSEDOWN, (evt) => {
      if (this.isContainerEvent(evt))
        gantt.fireMouseEvent(GanttEvent.MOUSEDOWN, new GanttMouseEvent(evt))
    })

    container.addEventListener(GanttEvent.MOUSEMOVE, (evt) => {
      if (this.isContainerEvent(evt))
        gantt.fireMouseEvent(GanttEvent.MOUSEMOVE, new GanttMouseEvent(evt))
    })

    container.addEventListener(GanttEvent.MOUSEUP, (evt) => {
      if (this.isContainerEvent(evt))
        gantt.fireMouseEvent(GanttEvent.MOUSEUP, new GanttMouseEvent(evt))
    })
  }

  private createGElement() {
    return document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    )
  }

  private tableView: TableView

  createSvg() {
    const { container } = this.gantt;
    const canvas = (this.canvas = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    ));
    canvas.classList.add('canvas')

    this.tableView = new TableView(
      this.gantt,
      this.gantt.options.viewMode,
      this.gantt.diffMonth + 1,
      this.gantt.options.columnWidth,
      this.gantt.options.headerHeight
    )

    this.tableView.init(canvas)

    this.drawPane = this.createGElement();
    this.drawPane.classList.add('drawPane');
    canvas.appendChild(this.drawPane);

    this.overlayPane = this.createGElement();
    this.overlayPane.classList.add('overlayPane');
    canvas.appendChild(this.overlayPane);

    const root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    root.style.left = '0px';
    root.style.top = '0px';
    root.style.width = '100%';
    root.style.height = '100%';
    root.style.display = 'block';
    root.classList.add('gantt')
    root.appendChild(this.canvas);

    if (container != null) {
      container.appendChild(root);
    }
  }

  getState(cell: GanttCell) {
    let state = null;
    if (cell) {
      state = this.states.get(cell)

      if (!state) {
        state = this.createState(cell);
        this.states.set(cell, state);
      }
    }

    return state;
  }

  createState(cell: GanttCell) {
    return new GanttCellState(this, cell)
  }

  invalidate(cell: GanttCell) {
    const state = this.getState(cell);

    if (state) {
      state.invalid = true
    }
  }

  validate() {
    const cells = this.gantt.model.cells;

    cells.forEach(cell => {
      const state = this.getState(cell);
      if (state?.invalid) {
        state.invalid = false;
        this.updateCellState(state);
        this.gantt.barRenderer.redraw(state)
      }
    })
  }

  private updateCellState(state: GanttCellState) {
    const geo = this.gantt.getCellGeometry(state.cell);

    if (geo !== null) {
      state.x = geo.x;
      state.y = geo.y;
      state.width = geo.width;
      state.height = geo.height;
    }
  }

  getDrawPane() {
    return this.drawPane;
  }

  getOverlayPane() {
    return this.overlayPane;
  }

  gantt: Gantt;
  states: Map<GanttCell, GanttCellState>;
  ganttBounds: GanttGeometry;
  private canvas: SVGGElement;
  private drawPane: SVGGElement;
  private overlayPane: SVGGElement;
}
