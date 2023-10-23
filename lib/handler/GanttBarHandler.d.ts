import Gantt from '../Gantt';
import GanttEventSource from '../util/GanttEventSource';
export default class GanttBarHandler extends GanttEventSource {
    gantt: Gantt;
    constructor(gantt: Gantt);
}
