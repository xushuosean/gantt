import Gantt from "../Gantt";
export default class GanttHandler {
    constructor(gantt: Gantt);
    mouseDown(): void;
    mouseMove(): void;
    mouseUp(): void;
    gantt: Gantt;
}
