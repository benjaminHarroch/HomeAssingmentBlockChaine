// src/utils/GraphBuilder.ts
import { GraphData, GraphNode, GraphLink } from "../types/graph";

export class GraphBuilder {
  private nodes: Map<string, GraphNode> = new Map();
  private links: GraphLink[] = [];

  addNode(address: string): void {
    if (!this.nodes.has(address)) {
      this.nodes.set(address, { id: address, label: address.slice(0, 8) + "..." , totalSent: 0, totalReceived: 0 });
    }
  }

  addLink(source: string, target: string, value: number, txid: string): void {
    this.links.push({ nodeSource: source, nodeTarget: target, valueTransaction: value, txid });
  }

  build(address: string): GraphData {
    const filteredLinks = this.filter(address);
    const nodeIds = new Set<string>();
    for (const l of filteredLinks) {
      nodeIds.add(l.nodeSource);
      nodeIds.add(l.nodeTarget);
    }
    const filteredNodes = Array.from(this.nodes.values()).filter(n => nodeIds.has(n.id));
    return {
      nodes: filteredNodes,
      links: filteredLinks,
    };
  }

  filter(address: string): GraphLink[] {
    const filteredLinks = this.links.filter(
      link => link.nodeSource === address || link.nodeTarget === address
    );
    return filteredLinks;
  }

  incrementSent(id: string, amount: number) {
  const node = this.nodes.get(id);
  if (node) node.totalSent = (node.totalSent || 0) + amount;
}

  incrementReceived(id: string, amount: number) {
   const node = this.nodes.get(id);
   if (node) node.totalReceived = (node.totalReceived || 0) + amount;
}
}
