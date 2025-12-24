import axios from "axios";

export interface Pod {
  address?: string;
  is_public?: boolean;
  last_seen_timestamp: number;
  pubkey?: string;
  rpc_port?: number;
  storage_committed?: number;
  storage_used?: number;
  uptime?: number;
  version?: string;
}

export const DEFAULT_SEED_IPS = [
  "173.212.220.65",
  "161.97.97.41",
  "192.190.136.36",
  "192.190.136.38",
  "207.244.255.1",
  "192.190.136.28",
  "192.190.136.29",
  "173.212.203.145",
];

export function toMillisMaybe(ts: number): number {
  return ts > 10_000_000_000 ? ts : ts * 1000;
}

async function prpcCall(seedIp: string, method: string) {
  const url = `http://${seedIp}:6000/rpc`;
  const res = await axios.post(
    url,
    { jsonrpc: "2.0", method, id: 1 },
    { timeout: 5000 }
  );
  return res.data.result;
}

export async function getPods(seedIp: string) {
  return prpcCall(seedIp, "get-pods");
}

export async function getPodsWithStats(seedIp: string) {
  const url = `http://${seedIp}:6000/rpc`;
  const res = await axios.post(url, { 
    jsonrpc: '2.0', 
    method: 'get-pods-with-stats', // <--- IMPORTANT CHANGE
    id: 1 
  }, { timeout: 8000 });
  return res.data.result;
}