export interface GraphNode {
  id: string;
  label?: string;
  color?: string;
  x?: number;
  y?: number;
  totalSent?: number;
  totalReceived?: number;
}

export interface GraphLink {
  nodeSource: string;
  nodeTarget: string;
  valueTransaction?: number;
  value?: number;
  color?: string;
  txid?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
