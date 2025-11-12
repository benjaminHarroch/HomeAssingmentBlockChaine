"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { GraphData, GraphNode, GraphLink } from "../../types/graph";
import { LinkObject, NodeObject } from "react-force-graph-2d";

// טעינה דינמית (בלי SSR)
const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d").then((mod) => mod.default),
  { ssr: false }
) as unknown as React.FC<any>;

interface GraphVisualizerProps {
  data: GraphData;
  centerNode: string;
  loading: boolean;
  onNodeClick: (id: string, node: GraphNode) => void;
}

export default function GraphVisualizer({
  data,
  centerNode,
  loading,
  onNodeClick,
}: GraphVisualizerProps) {
  const [minVal, maxVal] = useMemo(() => {
    if (!data?.links?.length) return [0, 1];
    const values = data.links.map((l: GraphLink) => l.valueTransaction || 0);
    return [Math.min(...values), Math.max(...values)];
  }, [data]);

  const getLinkWidth = (value: number) => {
    if (maxVal === minVal) return 2;
    const normalized = (value - minVal) / (maxVal - minVal);
    return 1 + normalized * 6;
  };

  const validLinks = useMemo(() => {
    if (!data?.links) return [];
    const nodeIds = new Set(data.nodes.map((n: GraphNode) => n.id));
    return data.links
      .filter(
        (l: GraphLink) =>
          l.nodeSource &&
          l.nodeTarget &&
          nodeIds.has(l.nodeSource) &&
          nodeIds.has(l.nodeTarget)
      )
      .map((l: GraphLink) => ({
        source: l.nodeSource,
        target: l.nodeTarget,
        value: l.valueTransaction || 0,
        color: l.nodeTarget === centerNode ? "#22c55e" : "#ef4444",
      }));
  }, [data, centerNode]);

  const nodes = useMemo(() => {
    if (!data?.nodes) return [];
    return data.nodes.map((n: GraphNode) => ({
      ...n,
      color: n.id === centerNode ? "#facc15" : "#60a5fa",
    }));
  }, [data, centerNode]);

  const graphData = useMemo(() => ({ nodes, links: validLinks }), [nodes, validLinks]);

  return (
    <div data-testid="graph-container" className="relative w-full flex justify-center items-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      )}

      {graphData.nodes.length > 0 && (
        <ForceGraph2D
          graphData={graphData}
          backgroundColor="#0d1117"
          nodeRelSize={7}
          linkColor={(link: Partial<GraphLink>) => link.color || "#888"}
          linkWidth={(link: Partial<GraphLink>) => getLinkWidth(link.valueTransaction || 0)}
          linkDirectionalArrowLength={5}
          linkDirectionalArrowRelPos={0.95}
          linkCurvature={0.2}
          nodeCanvasObject={(node: Partial<GraphNode>, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const id = String(node.id ?? "");
            const label = node.label || id.substring(0, 8);
            const fontSize = 12 / globalScale;
            const color = node.color || "#fff";

            if (node.x !== undefined && node.y !== undefined) {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
              ctx.fill();
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "top";
              ctx.fillStyle = "#fff";
              ctx.fillText(label, node.x, node.y + 8);
            }
          }}
          onNodeClick={(node: Partial<GraphNode>) => {
            //console.log("Node clicked:", node);
            const id = String(node.id ?? "");
            if (id !== centerNode) onNodeClick(id, node as GraphNode);
          }}
          width={typeof window !== "undefined" ? window.innerWidth * 0.95 : 800}
          height={600}
        />
      )}
    </div>
  );
}
