import { GraphBuilder } from "./GraphBuilder";
import { GraphData } from "../types/graph";

export function parseBlockchainTxs(txs: any[], address: string): GraphData {

function voutValue(tx: any, address: string): number {
  if (!tx || !Array.isArray(tx.vout)) return 0;

  const output = tx.vout.find((v: any) => v?.scriptpubkey_address === address);

  return output && typeof output.value === "number" ? output.value / 1e8 : 0;
}

  const builder = new GraphBuilder();

  for (const tx of txs) {
    // console.log(`Processing transaction: ${tx.vin[0]?.txid}`);
    //  console.log(`Processing transaction2: ${tx.vout[0]?.txid}`);
    const fromAddrs = tx.vin
      .map((v: any) => v.prevout?.scriptpubkey_address)
      .filter(Boolean);

    const toAddrs = tx.vout
      .map((v: any) => v.scriptpubkey_address)
      .filter(Boolean);

    for (const from of fromAddrs) {
      for (const to of toAddrs) {

        builder.addNode(from);
        builder.addNode(to);

       const value = voutValue(tx, to);

        builder.addLink(from, to, voutValue(tx, to), tx.txid);

        builder.incrementSent(from, value);
        builder.incrementReceived(to, value);
      }
    }
  }

  return builder.build(address);
}

