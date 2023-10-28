import { GanttGeometry } from "../model/GanttGeometry";
import { Point } from "./Point";
export declare function convertPoint(container: any, x: any, y: any): Point;
export declare function getScrollOrigin(node: any, includeAncestors: any): Point;
export declare function getOffset(container: any): Point;
export declare function contains(bounds: GanttGeometry, x: number, y: number): boolean;
