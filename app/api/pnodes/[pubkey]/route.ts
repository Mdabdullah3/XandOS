/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import {
  DEFAULT_SEED_IPS,
  getPodsWithStats,
  toMillisMaybe,
} from "@/app/lib/prpc";

// Ensure this matches the Next.js 15 expected type
type Props = {
  params: Promise<{ pubkey: string }>;
};

export async function GET(req: Request, { params }: Props) {
  try {
    // ✅ NEXT.JS 15 FIX: You MUST await params
    const resolvedParams = await params;
    const pubkey = resolvedParams.pubkey;

    const now = Date.now();

    // Query seeds for this specific node audit
    const results = await Promise.allSettled(
      DEFAULT_SEED_IPS.slice(0, 3).map((ip) => getPodsWithStats(ip))
    );

    let foundNode: any = null;

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value?.pods) {
        const node = result.value.pods.find((p: any) => p.pubkey === pubkey);
        if (node) {
          const lastSeenMs = toMillisMaybe(node.last_seen_timestamp);
          foundNode = {
            pubkey: node.pubkey,
            address: node.address,
            version: node.version || "0.8.0",
            storageCapacity: Number(node.storage_committed || 0),
            storageUsed: Number(node.storage_used || 0),
            credits: Number(node.credits || 0),
            uptime: Number(node.uptime || 0),
            packetsIn: Number(node.packets_received || 0),
            packetsOut: Number(node.packets_sent || 0),
            lastSeen: lastSeenMs,
            status: now - lastSeenMs <= 300000 ? "online" : "offline",
          };
        }
      }
    });

    if (foundNode) {
      return NextResponse.json({ success: true, node: foundNode });
    }

    return NextResponse.json(
      { success: false, error: "Node not found" },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Audit Failed" },
      { status: 500 }
    );
  }
}
