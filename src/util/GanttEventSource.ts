import GanttEventObject from "./GanttEventObject";

export default class GanttEventSource {
  constructor() { }

  eventListeners: any[] = []
  addListener(name: string, listener: any) {
    if (this.eventListeners == null) {
      this.eventListeners = [];
    }

    this.eventListeners.push(name);
    this.eventListeners.push(listener);
  }

  removeListener(listener: any) {
    if (this.eventListeners != null) {
      var i = 0;

      while (i < this.eventListeners.length) {
        if (this.eventListeners[i + 1] == listener) {
          this.eventListeners.splice(i, 2);
        }
        else {
          i += 2;
        }
      }
    }
  }

  fireEvent(evt: GanttEventObject) {
    if (this.eventListeners != null) {

      const args = [evt]
      for (var i = 0; i < this.eventListeners.length; i += 2) {
        var listen = this.eventListeners[i];

        if (listen === null || listen === evt.getName()) {
          this.eventListeners[i + 1].apply(this, args);
        }
      }
    }
  }
}
