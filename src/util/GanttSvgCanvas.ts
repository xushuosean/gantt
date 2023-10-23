export default class GanttSvgCanvas {
  constructor(root: any) {
    this.root = root
  }

  rect(x: number, y: number, width: number, height: number, rx?: number, paddingVertical?: number, paddingHorizontal?: number) {
    const n = this.createElement('rect');

    if (paddingVertical) {
      height -= paddingVertical;
      y += paddingVertical / 2;
    }

    if (paddingHorizontal) {
      width -= paddingHorizontal;
      x += paddingHorizontal / 2;
    }

    n.setAttribute('x', `${x}`);
    n.setAttribute('y', `${y}`);
    n.setAttribute('width', `${width}`);
    n.setAttribute('height', `${height}`);

    if (rx) {
      n.setAttribute('rx', `${rx}`)
    }



    this.node = n;
  }

  ellipse(x: number, y: number, width: number, height: number) {
    const n = this.createElement('ellipse');

    n.setAttribute('cx', `${x + width / 2}`);
    n.setAttribute('cy', `${y + height / 2}`);
    n.setAttribute('rx', `${width / 2}`);
    n.setAttribute('ry', `${height / 2}`);

    this.node = n;
  }

  end() {
    this.addNode()
  }

  addNode() {
    this.root.appendChild(this.node)
  }

  createElement(tagName: string) {
    const elt = this.root.ownerDocument.createElement(tagName);
    return elt;
  }

  root: SVGElement;
  node: HTMLElement;
}
