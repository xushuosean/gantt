import Gantt from '../Gantt'
import GanttEventSource from '../util/GanttEventSource';
import GanttEvent from '../util/GanttEvent';

export default class GanttBarHandler extends GanttEventSource {
  gantt: Gantt;
  constructor(gantt: Gantt) {
    super();
    this.gantt = gantt;
  }
}
