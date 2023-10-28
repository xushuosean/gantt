import { Dayjs } from "dayjs";
import Gantt, { ViewMode } from "../Gantt";
import { createSVG } from "../util";
import GanttEventSource from "../util/GanttEventSource";
import { GanttGeometry } from "../model/GanttGeometry";

export class TableView extends GanttEventSource {
  gantt: Gantt;
  mode: ViewMode;
  columnNum: number;
  columnWidth: number;
  headerHeight: number;

  container: SVGGElement;
  tableHeaderPanel: SVGGElement;
  tableBodyPanel: SVGGElement;
  tableBorderPanel: SVGGElement;

  constructor(
    gantt: Gantt,
    mode: ViewMode,
    columnNum: number,
    columnWidth: number,
    headerHeight: number,
  ) {
    super();
    this.gantt = gantt;
    this.mode = mode;
    this.columnNum = columnNum;
    this.columnWidth = columnWidth;
    this.headerHeight = headerHeight;
  }

  init(container: SVGGElement) {
    this.container = container
    this.createSvg();
    this.renderTable();
  }

  createSvg() {
    const tablePanel = this.createGElement()

    this.tableHeaderPanel = this.createGElement();
    this.tableHeaderPanel.classList.add('tableHeaderPanel');
    tablePanel.appendChild(this.tableHeaderPanel)

    this.tableBodyPanel = this.createGElement();
    this.tableBodyPanel.classList.add('tableBodyPanel');
    tablePanel.appendChild(this.tableBodyPanel)

    this.tableBorderPanel = this.createGElement();
    this.tableBorderPanel.classList.add('tableBorderPanel');
    tablePanel.appendChild(this.tableBorderPanel)

    this.container.appendChild(tablePanel)
  }

  renderTable() {
    this.redrawTableHeader();
    this.redrawTableBody();
    this.redrawTableBorder();

    this.updateGanttBounds();
  }

  updateGanttBounds() {
    this.gantt.view.ganttBounds = new GanttGeometry(0, 0, this.getTableWidth(), this.getTableHeight());
  }

  redrawTableHeader() {
    createSVG('rect', {
      x: 0,
      y: 0,
      width: this.getTableWidth(),
      height: this.headerHeight,
      class: 'headerBackground',
      append_to: this.tableHeaderPanel
    })

    for (let i = 0; i <= this.columnNum; i++) {
      const curDate = this.gantt.ganttStart.add(i, 'month');
      const curYear = curDate.year();
      const curMonth = curDate.month() + 1;
      if (curMonth === 6) {
        createSVG('text', {
          x: i * this.getRenderColumnWidth() + this.getRenderColumnWidth() / 2,
          y: 30,
          innerHTML: curYear,
          append_to: this.tableHeaderPanel
        })
      }
      createSVG('text', {
        x: i * this.getRenderColumnWidth(),
        y: 50,
        innerHTML: curMonth,
        append_to: this.tableHeaderPanel
      })
    }
  }

  /** row 高度 */
  get rowHeight() {
    return this.gantt.options.barHeight + this.gantt.options.padding
  }

  redrawTableBody() {
    let bodyHeight = 0;
    this.gantt.tasks.forEach((task, index) => {
      createSVG('rect', {
        x: 0,
        y: index * this.rowHeight + this.headerHeight,
        width: this.getTableWidth(),
        height: this.rowHeight,
        class: 'bodyRow',
        append_to: this.tableBodyPanel,
      })
      bodyHeight += this.rowHeight;
    })
  }

  redrawTableBorder() {
    // 竖向 line
    for (let i = 0; i <= this.columnNum; i++) {
      createSVG('line', {
        x1: this.getRenderColumnWidth() * i,
        y1: this.headerHeight,
        x2: this.getRenderColumnWidth() * i,
        y2: this.headerHeight + this.rowHeight * this.gantt.tasks.length,
        class: 'row-line',
        append_to: this.tableBorderPanel,
      });
    }
  }

  private createGElement() {
    return document.createElementNS('http://www.w3.org/2000/svg', 'g');
  }

  /** 获取 header 宽度 */
  private getTableWidth() {
    return this.columnNum * this.getRenderColumnWidth();
  }

  private getTableHeight() {
    return this.headerHeight + this.rowHeight * this.gantt.tasks.length
  }

  private getRenderColumnWidth() {
    if (this.mode) {
      return this.columnWidth * 4;
    }
    return this.columnWidth;
  }

}
