import Gantt from '../Gantt'
import GanttEventSource from '../utils/GanttEventSource';
import GanttEvent from '../utils/GanttEvent';

export default class GanttBarHandler extends GanttEventSource {
  gantt: Gantt;
  constructor(gantt: Gantt) {
    super();
    this.gantt = gantt;
  }
}
