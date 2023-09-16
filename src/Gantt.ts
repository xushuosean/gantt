import { CodeToGantt } from './CodeToGantt';
import { GanttGeometry } from './model/GanttGeometry';
import { QUnitType } from "dayjs";
import GanttEventSource from './utils/GanttEventSource';

import GanttBarHandler from './handler/GanttBarHandler'
import GanttPopupHandler from './handler/GanttPopupHandler';

import GanttBarRenderer from './view/GanttBarRenderer';

import GanttHandler from './handler/GanttHandler';

import './gantt.css'
import GanttEvent from "./utils/GanttEvent";

import GanttView from './view/GanttView';

import GanttModel, { GanttChildChange } from './model/GanttModel';
import GanttCell from './model/GanttCell';
import dayjs = require('dayjs');

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

  constructor(container: HTMLElement, tasks: GanttTask[], options: GanttOptions) {
    super();
    this.tasks = tasks;
    this.options = options;
    this.container = container;
    this.setupOptions();
    this.barRenderer = this.createBarRenderer()
    this.createHandlers();
    this.model = new GanttModel();

    this.view = this.createGanttView();

    this.model.addListener(GanttEvent.CHANGE, (changes: any) => {
      changes.forEach(this.processChange.bind(this))

      this.view.validate();
    })

    this.codeToGantt = new CodeToGantt(this, this.tasks, this.options)

    if (container) {
      this.init(container)
    }

    this.sizeDidChange();

    this.autoCreateCell();
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

  fireMouseEvent(eventName: string, ...args: any[]) {
    for (let i = 0; i < this.mouseListeners.length; i++) {
      const l = this.mouseListeners[i];

      if (eventName === GanttEvent.MOUSEDOWN) {
        l.mouseDown.apply(this, args);
      } else if (eventName === GanttEvent.MOUSEMOVE) {
        l.mouseMove.apply(this, args);
      } else if (eventName === GanttEvent.MOUSEUP) {
        l.mouseUp.apply(this, args);
      }
    }

    if (eventName === GanttEvent.MOUSEUP) {
      this.click()
    }
  }

  click() {
    console.log('here run click')
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
    this.createBarHandler();
    this.createPopupHandler();
    this.ganttHandler = this.createGanttHandler();
  }

  createGanttHandler() {
    return new GanttHandler(this);
  }

  createBarHandler() {
    return new GanttBarHandler(this);
  }

  createPopupHandler() {
    return new GanttPopupHandler(this);
  }

  // render() {
  //   this.redrawBar();
  // }

  // redrawBar() {
  //   this.tasks.forEach((task, index) => {
  //     const barWrapper = this.createGElement();
  //     barWrapper.classList.add('barWrapper')
  //     this.barPanel.appendChild(barWrapper);

  //     this.redrawBarWrapper(barWrapper, task, index);
  //   })

  // }

  // redrawBarWrapper(parent: SVGGElement, task: GanttTask, index: number) {
  //   const barGroup = this.createGElement();
  //   barGroup.classList.add('barGroup')
  //   parent.appendChild(barGroup)

  //   this.redrawBarGroup(barGroup, task, index);
  // }

  // redrawBarGroup(parent: SVGGElement, task: GanttTask, index: number) {
  //   const paddingLeft = dayjs(task.start).diff(this.ganttStart, viewModeMapDayjsUnit[this.options.viewMode] as QUnitType)
  //   const steps = this.getSplitNumber(task);
  //   createSVG('rect', {
  //     x: paddingLeft * this.getRenderColumnWidth(),
  //     y: this.headerHeight + this.rowHeight * index + this.options.padding / 2,
  //     height: this.options.barHeight,
  //     width: this.getRenderColumnWidth() * steps,
  //     rx: '3',
  //     ry: '3',
  //     class: 'bar',
  //     append_to: parent
  //   })

  //   createSVG('text', {
  //     x: paddingLeft * this.getRenderColumnWidth() + this.getRenderColumnWidth() * steps / 2,
  //     y: this.headerHeight + this.rowHeight * index + this.options.padding / 2 + this.options.barHeight / 2,
  //     class: 'barText',
  //     innerHTML: task.name,
  //     append_to: parent
  //   })
  // }

  getSplitNumber(task: GanttTask) {
    return dayjs(task.end).diff(dayjs(task.start), viewModeMapDayjsUnit[this.options.viewMode] as QUnitType) + 1
  }

  createGElement() {
    return document.createElementNS('http://www.w3.org/2000/svg', 'g');
  }

  setupOptions() {
    const defaultOptions: GanttOptions = {
      headerHeight: 50,
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
