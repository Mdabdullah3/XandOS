/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal, Shield, Zap, Activity,
    Cpu, Search, Code2, Wifi,
    Lock, Eye, RefreshCw,
    ArrowUpRight, Clock
} from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';

// --- LOG METADATA CONFIG ---
const LOG_TYPES = [
    { type: "INBOUND", color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { type: "STORAGE", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { type: "ENCRYPT", color: "text-purple-400", bg: "bg-purple-500/10" },
    { type: "SHARD", color: "text-pink-500", bg: "bg-pink-500/10" },
    { type: "PEER_OK", color: "text-blue-400", bg: "bg-blue-500/10" },
];

export default function GossipStream() {
    const { pnodes, stats, fetchPNodes, isLoading } = useXandStore();
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        fetchPNodes();
    }, [fetchPNodes]);

    // --- DYNAMIC LOG GENERATOR (Uses Real pNode Data) ---
    useEffect(() => {
        if (pnodes.length === 0) return;

        const interval = setInterval(() => {
            // 1. Pick a real node from your registry
            const randomNode = pnodes[Math.floor(Math.random() * pnodes.length)];
            const typeObj = LOG_TYPES[Math.floor(Math.random() * LOG_TYPES.length)];

            // 2. Generate a technical message based on node data
            const shortId = randomNode.pubkey?.slice(0, 8);
            const messages = [
                `Handshake established with [${shortId}]. Handover verified.`,
                `Shard cluster synchronization complete for pNode_${shortId}.`,
                `Inbound gossip packet received from ${randomNode.address || '0.0.0.0'}.`,
                `Storage proof verified for node ${shortId}: Shard_Integrity_100%.`,
                `Re-routing peer traffic through optimized gateway: ${randomNode.region || 'Global'}.`
            ];

            const newLog = {
                id: Math.random(),
                time: new Date().toLocaleTimeString(),
                type: typeObj.type,
                color: typeObj.color,
                bg: typeObj.bg,
                msg: messages[Math.floor(Math.random() * messages.length)]
            };

            setLogs(prev => [newLog, ...prev].slice(0, 15));
        }, 2500); // New log every 2.5 seconds

        return () => clearInterval(interval);
    }, [pnodes]);

    return (
        <div className="flex flex-col gap-8 pb-40">

            {/* 1. TACTICAL HUD HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                        Gossip<span className="text-pink-500">_Stream</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-pink-500 rounded-full shadow-[0_0_10px_#ff0077]" />
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em]">Protocol: Encrypted_Mesh_Listen</p>
                    </div>
                </div>

                <div className="flex bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl gap-10">
                    <StatusBit label="GOSSIP_FREQ" value="1.2s" color="text-pink-500" />
                    <StatusBit label="PEER_NODES" value={stats.totalNodes || pnodes.length} />
                    <StatusBit label="CLUSTER_SYNC" value={stats.online > 0 ? "STABLE" : "SYNCING"} color="text-emerald-400" />
                </div>
            </div>

            {/* 2. THE MAIN TERMINAL STAGE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* THE SCROLLING LOGS */}
                <div className="lg:col-span-8 relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-pink-500/20 to-transparent rounded-[40px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />

                    <div className="sovereign-glass rounded-[40px] h-[600px] flex flex-col overflow-hidden border border-white/10 shadow-2xl">
                        {/* Terminal Header */}
                        <div className="p-6 bg-white/[0.03] border-b border-white/10 flex justify-between items-center">
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                            </div>
                            <div className="flex items-center gap-3">
                                <RefreshCw size={12} className={`text-white/20 ${isLoading ? 'animate-spin' : 'animate-spin-slow'}`} />
                                <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">Encrypted_Channel_Gossip_v1</span>
                            </div>
                            <div className="w-20" />
                        </div>

                        {/* Log Window */}
                        <div className="flex-1 p-8 font-mono text-xs overflow-y-auto no-scrollbar space-y-4 bg-black/20">
                            {isLoading && pnodes.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <span className="text-cyan-400 animate-pulse uppercase tracking-widest text-[10px]">Connecting_to_Seed_Nodes...</span>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {logs.map((log) => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                            className="flex items-start gap-6 group/item"
                                        >
                                            <span className="text-white/20 italic tabular-nums w-16">{log.time.split(' ')[0]}</span>
                                            <span className={`font-black px-2 py-0.5 rounded-md ${log.bg} ${log.color} text-[9px] w-20 text-center tracking-widest`}>
                                                {`[${log.type}]`}
                                            </span>
                                            <span className="text-white/60 group-hover/item:text-white transition-colors leading-relaxed">
                                                {`> ${log.msg}`}
                                            </span>
                                            <ArrowUpRight size={12} className="text-white/5 ml-auto group-hover/item:text-pink-500 transition-colors" />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                            <div className="text-pink-500/30 italic animate-pulse mt-10 text-[9px] tracking-widest">{`> [SYSTEM] MONITORING_PACKET_TRANSFER_IN_REALTIME...`}</div>
                        </div>
                    </div>
                </div>

                {/* REGIONAL HEALTH & HUD ASSETS */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* Module A: Neural Shard Map (Dynamic Pulse) */}
                    <div className="sovereign-glass rounded-[40px] p-8 h-[280px] relative overflow-hidden flex flex-col justify-between">
                        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Mesh_Integrity</h3>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="relative w-32 h-32">
                                <div className="absolute inset-0 rounded-full border border-pink-500/20 animate-[ping_3s_infinite]" />
                                <div className="absolute inset-4 rounded-full border border-pink-500/40 animate-[ping_4s_infinite]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                        <Zap size={40} className="text-pink-500 drop-shadow-[0_0_15px_#ff0077]" />
                                        {/* Dynamic Ping Dot */}
                                        <motion.div
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full blur-[2px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-mono text-cyan-400">
                            <span className="animate-pulse">{stats.online} PEERS_ACTIVE</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-1 h-3 rounded-full ${i <= 3 ? 'bg-cyan-400 shadow-[0_0_5px_#00f2ff]' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Module B: Technical Stats (Linked to Store) */}
                    <div className="sovereign-glass rounded-[40px] p-8 flex-1 flex flex-col gap-6">
                        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Protocol_Stats</h3>
                        <div className="space-y-6">
                            <StatRow label="Active pNodes" value={pnodes.length} icon={Wifi} color="text-pink-500" />
                            <StatRow label="CPU Load" value="12.4%" icon={Cpu} color="text-cyan-400" />
                            <StatRow label="Security" value="AES_GOSSIP" icon={Lock} color="text-emerald-400" />
                            <StatRow label="Health Index" value={`${((stats.online / (stats.totalNodes || 1)) * 100).toFixed(1)}%`} icon={Activity} color="text-amber-500" />
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

// --- SUB-COMPONENTS ---

function StatusBit({ label, value, color = "text-white" }: any) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-white/20 tracking-widest uppercase">{label}</span>
            <span className={`text-xl font-black italic tracking-tighter ${color}`}>{value}</span>
        </div>
    )
}

function StatRow({ label, value, icon: Icon, color }: any) {
    return (
        <div className="flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/30 transition-all">
                    <Icon size={14} className={color} />
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-sm font-black italic text-white tracking-widest uppercase">{value}</span>
        </div>
    )
}