import { GanttSelectionCellsHandler } from './handler/GanttSelectionCellsHandler';
import { GanttSelectionModel } from './model/GanttSelectionModel';
import { CodeToGantt } from './CodeToGantt';
import { GanttGeometry } from './model/GanttGeometry';
import { QUnitType } from "dayjs";
import GanttEventSource from './util/GanttEventSource';

import GanttBarHandler from './handler/GanttBarHandler'
import GanttPopupHandler from './handler/GanttPopupHandler';

import GanttBarRenderer from './view/GanttBarRenderer';

import GanttHandler from './handler/GanttHandler';

import './gantt.css'
import GanttEvent from "./util/GanttEvent";

import { contains, convertPoint } from './util/utils'

import GanttView from './view/GanttView';

import GanttModel, { GanttChildChange, mxGeometryChange } from './model/GanttModel';
import GanttCell from './model/GanttCell';
import dayjs = require('dayjs');
import { GanttMouseEvent } from './util/GanttMouseEvent';
import { GanttCellState } from './view/GanttCellState';
import GanttEventObject from './util/GanttEventObject';

const formatter = "YYYY-MM"

export interface IDisposable {
  dispose(): void
}

export enum ViewMode {
  DAY = "Day",
  WEEK = "Week",
  MONTH = "Month",
  YEAR = "Year"
}
// viewModel 到 dayjs 单位的 map
const viewModeMapDayjsUnit = {
  [ViewMode.DAY]: 'day',
  [ViewMode.WEEK]: 'week',
  [ViewMode.MONTH]: 'month',
  [ViewMode.YEAR]: 'year'
}

export type GanttTask = {
  id: string;
  start: string;
  end: string;
  name: string;
  value: any;
}

export type GanttOptions = {
  headerHeight: number,
  columnWidth: number,
  step: number,
  viewMode: ViewMode,
  barHeight: number,
  padding: number
}

export default class Gantt extends GanttEventSource implements IDisposable {
  container: HTMLElement;
  root: SVGSVGElement;
  tasks: GanttTask[];
  options: GanttOptions;

  canvas: SVGGElement;

  // table
  tablePanel: SVGGElement;

  tableHeaderPanel: SVGGElement;
  tableBodyPanel: SVGGElement;
  tableBorderPanel: SVGGElement;

  // bar
  barPanel: SVGGElement;

  // bar renderer
  barRenderer: GanttBarRenderer;

  view: GanttView;

  model: GanttModel;

  ganttHandler: GanttHandler;

  codeToGantt: CodeToGantt;

  selectionModel: GanttSelectionModel;

  selectionBarHandler: GanttSelectionCellsHandler;

  constructor(container: HTMLElement, tasks: GanttTask[], options: GanttOptions) {
    super();
    this.tasks = tasks;
    this.options = options;
    this.container = container;
    this.setupOptions();
    this.barRenderer = this.createBarRenderer()
    this.model = new GanttModel();
    this.selectionModel = new GanttSelectionModel(this)

    this.view = this.createGanttView();

    this.model.addListener(GanttEvent.CHANGE, (evt: GanttEventObject) => {
      evt.getProperty('edit').changes.forEach(this.processChange.bind(this))

      this.view.validate();
    })

    this.codeToGantt = new CodeToGantt(this, this.tasks, this.options)

    this.createHandlers()

    if (container) {
      this.init(container)
    }

    this.sizeDidChange();

    this.autoCreateCell();
  }

  setSelectionCell(cell: GanttCell) {
    this.selectionModel.setCell(cell)
  }

  setSelectionCells(cells: GanttCell[]) {
    this.selectionModel.setCells(cells)
  }

  sizeDidChange() {
    const bounds = this.view.ganttBounds;

    const root = this.view.getDrawPane().ownerSVGElement;
    if (root) {
      root.style.minWidth = `${bounds.width}px`;
      root.style.minHeight = `${bounds.height}px`;
    }
  }

  insertBar(id: string, value: any, x: number, y: number, width: number, height: number) {
    const ganttCell = new GanttCell(value, new GanttGeometry(x, y, width, height), {});
    ganttCell.id = id;

    this.addCell(ganttCell)
  }

  autoCreateCell() {
    this.codeToGantt.datas.forEach(item => {
      this.insertBar(item.id, item.value, item.x, item.y, item.width, item.height)
    })
  }

  processChange(change: any) {
    if (change instanceof GanttChildChange) {
      this.view.invalidate(change.cell)
    } else if (change instanceof mxGeometryChange) {
      this.view.invalidate(change.cell)
    }
  }

  createGanttView() {
    return new GanttView(this)
  }

  init(container: HTMLElement) {
    this.view.init()
  }

  addCell(cell: GanttCell) {
    this.addCells([cell])
  }

  addCells(cells: GanttCell[]) {
    cells.forEach(cell => {
      this.model.add(cell)
    })
  }

  mouseListeners: any[] = []

  addMouseListener(listener: any) {
    this.mouseListeners.push(listener);
  }

  intersects(state: GanttCellState, x: number, y: number): boolean {
    return contains(state.cell.geometry, x, y)
  }

  getCellAt(x: number, y: number) {
    const { cells } = this.model;

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const state = this.view.getState(cell);

      if (state && this.intersects(state, x, y)) {
        return cell
      }
    }
  }

  isMouseDown: boolean = false;

  updateMouseDown(me: GanttMouseEvent, eventName: string) {
    if (eventName === GanttEvent.MOUSEUP && this.isMouseDown) {
      this.isMouseDown = false;
    } else if (eventName === GanttEvent.MOUSEDOWN && !this.isMouseDown) {
      this.isMouseDown = true;
    }
  }

  fireMouseEvent(eventName: string, me: GanttMouseEvent) {

    const pt = convertPoint(this.container, me.getX(), me.getY());

    me.graphX = pt.x;
    me.graphY = pt.y;

    if (this.isMouseDown && eventName === GanttEvent.MOUSEMOVE) {
      const cell = this.getCellAt(me.graphX, me.graphY);
      if (cell) {
        me.state = this.view.getState(cell)
      }
    }

    this.updateMouseDown(me, eventName);

    for (let i = 0; i < this.mouseListeners.length; i++) {
      const l = this.mouseListeners[i];

      if (eventName === GanttEvent.MOUSEDOWN) {
        l.mouseDown.apply(l, [me]);
      } else if (eventName === GanttEvent.MOUSEMOVE) {
        l.mouseMove.apply(l, [me]);
      } else if (eventName === GanttEvent.MOUSEUP) {
        console.log(l, 'mouseup')
        l.mouseUp.apply(l, [me]);
      }
    }

    if (eventName === GanttEvent.MOUSEUP) {
      this.click(me)
    }
  }

  click(me: GanttMouseEvent) {
    const evt = me.getEvent();
    const cell = me.state?.cell;

    // todo: fire click event

    console.log(me.isComsumed())

    if (!me.isComsumed()) {
      if (cell) {
        this.setSelectionCell(cell);
      } else {
        this.clearSelection();
      }
    }
  }

  clearSelection() {
    this.selectionModel.clear();
  }

  getCellGeometry(cell: GanttCell) {
    return this.model.getGeometry(cell)
  }

  addBar() {

  }

  createBarRenderer() {
    return new GanttBarRenderer();
  }

  createHandlers() {
    this.selectionBarHandler = this.createSelectionBarHandler();
    this.ganttHandler = this.createGanttHandler();
    this.createPopupHandler();
  }

  createGanttHandler() {
    return new GanttHandler(this);
  }

  createBarHandler(state: GanttCellState) {
    return new GanttBarHandler(state);
  }

  createSelectionBarHandler() {
    return new GanttSelectionCellsHandler(this)
  }

  createPopupHandler() {
    return new GanttPopupHandler(this);
  }

  resizeCell(cell: GanttCell, bounds: GanttGeometry) {
    this.resizeCells([cell], [bounds])
  }

  resizeCells(cells: GanttCell[], bounds: GanttGeometry[]) {
    this.model.beginUpdate();
    try {
      this.cellsResized(cells, bounds)
    } finally {
      this.model.endUpdate();
    }
  }

  cellsResized(cells: GanttCell[], bounds: GanttGeometry[]) {
    this.model.beginUpdate();
    try {
      cells.forEach((cell, index) => {
        this.cellResized(cell, bounds[index])
      })
    } finally {
      this.model.endUpdate();
    }
  }

  cellResized(cell: GanttCell, bounds: GanttGeometry) {
    const prev = this.getCellGeometry(cell);

    const geo = prev?.clone()!;

    geo.x = bounds.x;
    geo.y = bounds.y

    geo.width = bounds.width;
    geo.height = bounds.height;

    this.model.beginUpdate();
    try {
      this.model.setGeometry(cell, geo)
    } finally {
      this.model.endUpdate();
    }
  }

  getSplitNumber(task: GanttTask) {
    return dayjs(task.end).diff(dayjs(task.start), viewModeMapDayjsUnit[this.options.viewMode] as QUnitType) + 1
  }

  createGElement() {
    return document.createElementNS('http://www.w3.org/2000/svg', 'g');
  }

  setupOptions() {
    const defaultOptions: GanttOptions = {
      headerHeight: 80,
      columnWidth: 30,
      step: 24,
      viewMode: ViewMode.DAY,
      barHeight: 30,
      padding: 18
    }

    this.options = Object.assign({}, defaultOptions, this.options)
  }

  getRenderColumnWidth() {
    if (this.options.viewMode) {
      return this.options.columnWidth * 4;
    }
    return this.options.columnWidth;
  }

  /** 获取 header 宽度 */
  getTableWidth() {
    return this.diffMonth * this.getRenderColumnWidth();
  }

  // get headerHeight() {
  //   return this.options.headerHeight + 10;
  // }

  get ganttStart() {
    return this.codeToGantt.ganttStart;
  }

  get ganttEnd() {
    return this.codeToGantt.ganttEnd;
  }

  get diffMonth() {
    return this.codeToGantt.diffMonth;
  }

  /** row 高度 */
  get rowHeight() {
    return this.options.barHeight + this.options.padding
  }

  dispose(): void { }
}
