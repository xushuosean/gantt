export class GanttUndoableEdit {
  constructor(source: any) {
    this.source = source;
    this.changes = []
  }

  add(change: any) {
    this.changes.push(change)
  }

  notify() { }

  isEmpty() {
    return this.changes.length === 0;
  }

  changes: any[];
  source: any;
}
