import Gantt from '../Gantt';
import GanttEventSource from '../utils/GanttEventSource';
export default class GanttPopupHandler extends GanttEventSource {
    gantt: Gantt;
    constructor(gantt: Gantt);
}
