export interface GraphNode {
  id: string;
  label?: string;
  totalSent?: number;
  totalReceived?: number;
}

export interface GraphLink {
  nodeSource: string;
  nodeTarget: string;
  valueTransaction: number;
  txid: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
