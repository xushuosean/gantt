import Gantt from '../Gantt';
import GanttEventSource from '../util/GanttEventSource';
export default class GanttPopupHandler extends GanttEventSource {
    gantt: Gantt;
    constructor(gantt: Gantt);
}
