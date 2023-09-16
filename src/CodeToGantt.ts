import { Dayjs } from 'dayjs';
import Gantt, { GanttOptions, GanttTask } from './Gantt'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax)

type GanttCellData = {
  id: string,
  value: any;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CodeToGantt {
  ganttStart: Dayjs;
  ganttEnd: Dayjs;

  constructor(
    gantt: Gantt,
    tasks: GanttTask[],
    options: GanttOptions
  ) {
    this.gantt = gantt;
    this.tasks = tasks;
    this.options = options;

    this.init();
  }

  init() {
    this.setupDate();

    this.convertToCell();
  }

  /** 获取最小最大值 */
  getMinMaxDate() {
    let minDate = dayjs(this.tasks[0].start)
    let maxDate = dayjs(this.tasks[0].end)
    this.tasks.forEach(task => {
      minDate = dayjs.min(dayjs(minDate), dayjs(task.start))!
      maxDate = dayjs.max(dayjs(maxDate), dayjs(task.end))!
    })

    return [minDate, maxDate];
  }

  setupDate() {
    [this.ganttStart, this.ganttEnd] = this.getMinMaxDate();
  }

  get diffMonth() {
    return this.ganttEnd.diff(this.ganttStart, 'month');
  }

  convertToCell() {
    this.datas = this.tasks.map((task, index) => {
      return this.doConvert(task, index)
    })
  }

  doConvert(task: GanttTask, index: number): GanttCellData {
    const paddingLeft = dayjs(task.start).month() - this.ganttStart.month()

    const x = paddingLeft * this.getRenderColumnWidth();
    const y = this.headerHeight + this.rowHeight * index + this.options.padding / 2;
    const width = this.getRenderColumnWidth() * this.getSplitNumber(task);
    const height = this.options.barHeight;
    return {
      id: task.id,
      value: task.value,
      x,
      y,
      width,
      height
    }
  }

  getSplitNumber(task: GanttTask) {
    return dayjs(task.end).diff(dayjs(task.start), 'month') + 1
  }

  getRenderColumnWidth() {
    if (this.options.viewMode) {
      return this.options.columnWidth * 4;
    }
    return this.options.columnWidth;
  }

  get headerHeight() {
    return this.options.headerHeight;
  }


  /** row 高度 */
  get rowHeight() {
    return this.options.barHeight + this.options.padding
  }

  datas: GanttCellData[] = [];

  gantt: Gantt;
  tasks: GanttTask[];
  options: GanttOptions;
}
