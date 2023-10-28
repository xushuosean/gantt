type CanvasState = {
  fillColor: string | null;
  alpha: number;
  strokeColor: string | null;
  dashed: boolean;
  dashPattern: string;
  fixDash: boolean;
  strokeWidth: number;
  scale: number;
  strokeAlpha: number
}

export default class GanttSvgCanvas {
  constructor(root: any) {
    this.root = root

    this.reset();
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
    this.addNode(true, true)
  }

  addNode(filled: boolean, stroke: boolean) {
    const node = this.node;
    if (node) {
      if (filled && this.state.fillColor) {
        this.updateFill();
      } else {
        node.setAttribute('fill', 'none')
      }

      if (stroke && this.state.strokeColor) {
        this.updateStroke();
      }

    }
    this.root.appendChild(this.node)
  }

  updateFill() {
    this.node.setAttribute('fill', String(this.state.fillColor).toLowerCase())
    this.node.setAttribute('fill-opacity', String(this.state.alpha).toLowerCase());
  }

  updateStroke() {
    const s = this.state;
    this.node.setAttribute('stroke', String(s.strokeColor).toLocaleLowerCase())

    if (s.alpha < 1 || s.strokeAlpha < 1) {
      this.node.setAttribute('stroke-opacity', (s.alpha * s.strokeAlpha).toString());
    }

    const sw = this.getCurrentStrokeWidth();

    if (sw !== 1) {
      this.node.setAttribute('stroke-width', sw.toString());
    }

    if (s.dashed) {
      this.node.setAttribute('stroke-dasharray', this.createDashPattern(
        ((s.fixDash) ? 1 : s.strokeWidth) * s.scale));
    }
  }

  format(value: any) {
    return parseFloat(parseFloat(value).toFixed(2));
  };

  getCurrentStrokeWidth() {
    return Math.max(this.minStrokeWidth, Math.max(0.01, this.format(this.state.strokeWidth * this.state.scale)));
  };

  createDashPattern(scale: number) {
    const pat = [];

    if (typeof (this.state.dashPattern) === 'string') {
      const dash = this.state.dashPattern.split(' ');

      if (dash.length > 0) {
        for (let i = 0; i < dash.length; i++) {
          pat[i] = Number(dash[i]) * scale;
        }
      }
    }

    return pat.join(' ');
  }

  createElement(tagName: string) {
    const elt = this.root.ownerDocument.createElement(tagName);
    return elt;
  }

  reset() {
    this.state = this.createState();
  }

  createState(): CanvasState {
    return {
      fillColor: null,
      alpha: 1,
      strokeColor: null,
      dashed: false,
      dashPattern: '3 3',
      fixDash: false,
      strokeWidth: 1,
      scale: 1,
      strokeAlpha: 1
    }
  }

  setFillColor(value: string) {
    this.state.fillColor = value;
  }

  setStrokeColor(value: string) {
    this.state.strokeColor = value;
  }

  setStrokeWidth(vaule: number) {
    this.state.strokeWidth = vaule;
  }

  setDashed(value: boolean, fixDash: boolean) {
    this.state.dashed = value;
    this.state.fixDash = fixDash;
  }

  setDashPattern(value: string) {
    this.state.dashPattern = value;
  };

  setAlpha(value: number) {
    this.state.alpha = value;
  }

  state: CanvasState;
  root: SVGElement;
  node: HTMLElement;

  minStrokeWidth: number = 1;
}
