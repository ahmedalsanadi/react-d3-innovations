import { HierarchyNode } from 'd3';

export interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
}

export interface TreemapHierarchyNode extends HierarchyNode<TreemapNode> {
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}