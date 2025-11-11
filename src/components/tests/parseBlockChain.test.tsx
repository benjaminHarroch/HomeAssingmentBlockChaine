// src/utils/parseBlockchainTxs.test.ts
import { parseBlockchainTxs } from "../../utils/parseBlockchainTxs";

describe("parseBlockchainTxs", () => {
  const mockTxs = [
    {
      txid: "tx123",
      vin: [{ prevout: { scriptpubkey_address: "A" } }],
      vout: [{ scriptpubkey_address: "B", value: 100000 }],
    },
  ];

  it("parses transactions and computes totals", () => {
    const graph = parseBlockchainTxs(mockTxs, "A");
    const nodeA = graph.nodes.find(n => n.id === "A");
    const nodeB = graph.nodes.find(n => n.id === "B");

    expect(nodeA?.totalSent).toBeCloseTo(0.001); // 100000 satoshis = 0.001 BTC
    expect(nodeB?.totalReceived).toBeCloseTo(0.001);
    expect(graph.links.length).toBe(1);
  });
});
