import Gantt from '../Gantt';
import GanttEventSource from '../utils/GanttEventSource';
export default class GanttBarHandler extends GanttEventSource {
    gantt: Gantt;
    constructor(gantt: Gantt);
}
