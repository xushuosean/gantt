import { Dayjs } from 'dayjs';
import Gantt, { GanttOptions, GanttTask } from './Gantt';
type GanttCellData = {
    id: string;
    value: any;
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare class GanttTasks {
    ganttStart: Dayjs;
    ganttEnd: Dayjs;
    constructor(gantt: Gantt, tasks: GanttTask[], options: GanttOptions);
    init(): void;
    /** 获取最小最大值 */
    getMinMaxDate(): any[];
    setupDate(): void;
    get diffMonth(): number;
    convertToCell(): void;
    doConvert(task: GanttTask, index: number): GanttCellData;
    getSplitNumber(task: GanttTask): any;
    getRenderColumnWidth(): number;
    get headerHeight(): number;
    /** row 高度 */
    get rowHeight(): number;
    datas: GanttCellData[];
    gantt: Gantt;
    tasks: GanttTask[];
    options: GanttOptions;
}
export {};
