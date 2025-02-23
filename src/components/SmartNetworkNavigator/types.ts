import { SimulationNodeDatum } from 'd3';

export interface NetworkNode extends SimulationNodeDatum {
  id: string;
  name: string;
  history?: NetworkNode[];
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NetworkLink {
  source: NetworkNode | string;
  target: NetworkNode | string;
  value: number;
}