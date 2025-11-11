import { GraphNode } from "../../types/graph";

export default function AddressDetails({ node, onLoadMore }: { node: GraphNode; onLoadMore: () => void }) {
  return (
    <div className="fixed top-4 right-4 w-80 bg-[#1a1f25] border border-gray-700 rounded-lg shadow-lg p-4 text-sm">
      <h2 className="text-lg font-semibold mb-2 text-yellow-400">Address Details</h2>
      <p>
        <span className="text-gray-400">Address:</span>
        <br />
        <span className="break-all">{node.id}</span>
      </p>
      <p className="text-sm text-gray-300">
       <strong>Total Received:</strong> {node?.totalReceived?.toFixed(8) || 0} BTC
      </p>
      <p className="text-sm text-gray-300">
       <strong>Total Sent:</strong> {node?.totalSent?.toFixed(8) || 0} BTC
      </p>
      <button
        onClick={onLoadMore}
        className="mt-4 bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
      >
        Load more transactions
      </button>
    </div>
  );
}
