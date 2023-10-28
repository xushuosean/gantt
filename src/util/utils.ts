import { GanttGeometry } from "../model/GanttGeometry";
import { Point } from "./Point";

export function convertPoint(container, x, y) {
  var origin = getScrollOrigin(container, false);
  var offset = getOffset(container);

  offset.x -= origin.x;
  offset.y -= origin.y;

  return new Point(x - offset.x, y - offset.y);
}

export function getScrollOrigin(node, includeAncestors) {
  includeAncestors = (includeAncestors != null) ? includeAncestors : false;

  var doc = (node != null) ? node.ownerDocument : document;
  var b = doc.body;
  var d = doc.documentElement;
  var result = new Point();

  while (node != null && node != b && node != d) {
    if (!isNaN(node.scrollLeft) && !isNaN(node.scrollTop)) {
      result.x += node.scrollLeft;
      result.y += node.scrollTop;
    }

    node = (includeAncestors) ? node.parentNode : null;
  }

  return result;
}

export function getOffset(container) {
  var offsetLeft = 0;
  var offsetTop = 0;

  // Ignores document scroll origin for fixed elements
  var fixed = false;
  var node = container;
  var b = document.body;
  var d = document.documentElement;

  while (node != null && node != b && node != d && !fixed) {
    node = node.parentNode;
  }

  var r = container.getBoundingClientRect();

  if (r != null) {
    offsetLeft += r.left;
    offsetTop += r.top;
  }

  return new Point(offsetLeft, offsetTop);
}

export function contains(bounds: GanttGeometry, x: number, y: number) {
  return (bounds.x <= x && bounds.x + bounds.width >= x &&
    bounds.y <= y && bounds.y + bounds.height >= y);
}
