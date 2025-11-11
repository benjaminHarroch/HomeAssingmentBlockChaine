"use client";

import { useState } from "react";
import { GraphData } from "../types/graph";
import GraphVisualizer from "../components/Graph/GraphVisualizer";
import AddressDetails from "../components/AddressDetails/AddressDetails";
import ErrorBoundary from "../components/common/ErrorBoundary";

export default function Home() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchGraph(addr?: string, loadMore = false) {
    const target = addr || address;
    if (!target) return;

    setAddress(target);
    setError(null);
    setLoading(true);

    const start = new Date();
    setLogs((prev) => [
      ...prev,
      `📡 [${start.toLocaleTimeString()}] Fetching graph for: ${target}`,
    ]);

    try {
      const res = await fetch(`/api/blockchain?address=${target}&limit=${loadMore ? 50 : 20}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const end = new Date();
      setLogs((prev) => [
        ...prev,
        `✅ [${end.toLocaleTimeString()}] Loaded ${json.links.length} transactions (${end.getTime() - start.getTime()}ms)`,
      ]);
      setData(json);
    } catch (err: any) {
      setError(err.message);
      const time = new Date();
      setLogs((prev) => [
        ...prev,
        `❌ [${time.toLocaleTimeString()}] Error: ${err.message}`,
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleNodeClick = (id: string, nodeData?: any) => {
    setSelectedNode(nodeData || { id });
    fetchGraph(id);
  };

  return (
    <ErrorBoundary onRetry={() => fetchGraph()}>
      <div className="min-h-screen flex flex-col items-center bg-[#0d1117] text-white p-6">
        <h1 className="text-3xl font-bold mb-4 text-yellow-400">Blockchain Investigator</h1>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Bitcoin address"
            className="border border-gray-700 bg-[#1a1f25] text-white px-3 py-2 rounded w-96"
          />
          <button
            onClick={() => fetchGraph()}
            disabled={loading}
            className={`px-4 py-2 rounded font-bold ${
              loading
                ? "bg-gray-600"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {loading ? "Loading..." : "Fetch"}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4">
            Error: {error}
            <button
              onClick={() => fetchGraph()}
              className="ml-3 underline hover:text-yellow-400"
            >
              Retry
            </button>
          </div>
        )}

        {/* Graph */}
        {data && (
          <GraphVisualizer
            data={data}
            centerNode={address}
            loading={loading}
            onNodeClick={(id, node) => handleNodeClick(id, node)}
          />
        )}

        {/* Address Details */}
        {selectedNode && (
          <AddressDetails
            node={selectedNode}
            onLoadMore={() => fetchGraph(selectedNode.id, true)}
          />
        )}

        {/* API Logs */}
        <div className="fixed bottom-4 right-4 w-96 bg-[#1a1f25] rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => setShowLogs((s) => !s)}
            className="w-full text-left px-3 py-2 bg-[#2a2f36] font-semibold hover:bg-[#323841]"
          >
            {showLogs ? "▼ Hide API Logs" : "▶ Show API Logs"}
          </button>
          {showLogs && (
            <div className="max-h-60 overflow-y-auto text-sm font-mono p-3 space-y-1">
              {loading && <p className="text-yellow-400">Loading...</p>}
              {logs.length === 0 ? (
                <p className="text-gray-500">No API activity yet.</p>
              ) : (
                logs.map((log, idx) => <div key={idx}>{log}</div>)
              )}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
