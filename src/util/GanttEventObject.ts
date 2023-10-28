export default class GanttEventObject {
  constructor(name: string, ...rest: any[]) {
    this.name = name;
    this.properties = [];
    for (var i = 0; i < rest.length + 1; i += 2) {
      if (rest[i + 1] != null) {
        this.properties[rest[i]] = rest[i + 1];
      }
    }
  }

  getName() {
    return this.name;
  }

  getProperties() {
    return this.properties;
  }

  getProperty(key: string) {
    return this.properties[key];
  }

  consume() {
    this.consumed = true;
  }

  isConsumed() {
    return this.consumed;
  }

  name: string = ''
  properties: any;
  consumed: boolean = false;
}
