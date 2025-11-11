"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function GraphVisualizer({ data, centerNode, loading, onNodeClick }) {

  const [minVal, maxVal] = useMemo(() => {
    if (!data?.links?.length) return [0, 1];
    const values = data.links.map((l) => l.valueTransaction || 0);
    return [Math.min(...values), Math.max(...values)];
  }, [data]);

  const getLinkWidth = (value) => {
    if (maxVal === minVal) return 2;
    const normalized = (value - minVal) / (maxVal - minVal);
    return 1 + normalized * 6;
  };

  const validLinks = useMemo(() => {
    if (!data?.links) return [];
    const nodeIds = new Set(data.nodes.map((n) => n.id));
    return data.links
      .filter(
        (l) =>
          l.nodeSource &&
          l.nodeTarget &&
          nodeIds.has(l.nodeSource) &&
          nodeIds.has(l.nodeTarget)
      )
      .map((l) => ({
        source: l.nodeSource,
        target: l.nodeTarget,
        value: l.valueTransaction || 0,
        color: l.nodeTarget === centerNode ? "#22c55e" : "#ef4444",
      }));
  }, [data, centerNode]);

  const nodes = useMemo(() => {
    if (!data?.nodes) return [];
    return data.nodes.map((n) => ({
      ...n,
      color: n.id === centerNode ? "#facc15" : "#60a5fa",
    }));
  }, [data, centerNode]);

  const graphData = useMemo(() => ({ nodes, links: validLinks }), [nodes, validLinks]);

  return (
    <div className="relative w-full flex justify-center items-center">
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
          linkColor={(link) => link.color}
          linkWidth={(link) => getLinkWidth(link.value)} 
          linkDirectionalArrowLength={5}
          linkDirectionalArrowRelPos={0.95}
          linkCurvature={0.2}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.label || node.id.substring(0, 8);
            const fontSize = 12 / globalScale;
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = "#fff";
            ctx.fillText(label, node.x, node.y + 8);
          }}
          onNodeClick={(node) => {
            if (node.id !== centerNode) onNodeClick(node.id, node);
          }}
          width={typeof window !== "undefined" ? window.innerWidth * 0.95 : 800}
          height={600}
        />
      )}
    </div>
  );
}
