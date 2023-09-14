import Gantt from "../Gantt";

export default class GanttHandler {
  constructor(gantt: Gantt) {
    this.gantt = gantt;

    this.gantt.addMouseListener(this)
  }

  mouseDown() {

    console.log('here run mousedown')
  }

  mouseMove() { }
  mouseUp() { }

  gantt: Gantt;
}
