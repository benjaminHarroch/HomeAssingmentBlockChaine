import { NextResponse } from "next/server";
import { parseBlockchainTxs } from "../../../utils/parseBlockchainTxs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address =
    searchParams.get("address") || "1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F";

  try {
    const res = await fetch(`https://blockstream.info/api/address/${address}/txs`);
    if (!res.ok) throw new Error("Failed to fetch external API");
    const data = await res.json();
     //console.log('before parsing data', data);
    const graphData = parseBlockchainTxs(data,address);
    return NextResponse.json(graphData);
  } catch (err) {
    console.error("Error fetching blockchain data:", err);
    return NextResponse.json(
      { error: "Failed to fetch blockchain data" },
      { status: 500 }
    );
  }
}
