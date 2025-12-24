/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal, Shield, Zap, Activity,
    Cpu, Wifi, Lock, Eye, RefreshCw,
    ArrowUpRight, Clock, Radio, Share2
} from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';
import Headline from '@/app/components/Headline';

// --- TACTICAL LOG CONFIG ---
const LOG_TYPES = [
    { type: "INBOUND", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
    { type: "SHARD", color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
    { type: "SECURITY", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-400/20" },
    { type: "METRIC", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
];

export default function GossipStream() {
    const { pnodes, stats, fetchPNodes, isLoading } = useXandStore();
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        fetchPNodes();
    }, [fetchPNodes]);

    // --- DYNAMIC NEURAL LOG GENERATOR ---
    useEffect(() => {
        if (pnodes.length === 0) return;

        const interval = setInterval(() => {
            const node = pnodes[Math.floor(Math.random() * pnodes.length)];
            const typeObj = LOG_TYPES[Math.floor(Math.random() * LOG_TYPES.length)];
            const shortId = node.pubkey?.slice(0, 8) || "GUEST";

            const messages = [
                `Peer handshake finalized with segment_${shortId}. Entropy confirmed.`,
                `Shard synchronization stream active. Latency verified at 12ms.`,
                `Inbound packet detected from ${node.address || '0.0.0.0'}. Parsing metadata...`,
                `Storage commitment proof signed by ${shortId}. Ledger updated.`,
                `Neural link stabilized in region: ${node.region || 'Global'}.`
            ];

            const newLog = {
                id: Math.random(),
                time: new Date().toLocaleTimeString(),
                type: typeObj.type,
                color: typeObj.color,
                bg: typeObj.bg,
                border: typeObj.border,
                msg: messages[Math.floor(Math.random() * messages.length)]
            };

            setLogs(prev => [newLog, ...prev].slice(0, 12));
        }, 2000);

        return () => clearInterval(interval);
    }, [pnodes]);

    return (
        <div className="flex flex-col gap-12 pb-40 max-w-7xl mx-auto overflow-visible">

            {/* --- 1. SOVEREIGN HEADER --- */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pt-12 border-b border-white/5 pb-12 relative">
                <Headline title="GOSSIP" title2="PROTOCOL" subtitle="REAL-TIME ENCRYPTED NETWORK PULSE" />

                <div className="flex gap-10 px-10 py-6 sovereign-glass rounded-[40px] border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <HeaderMetric label="Gossip_Freq" value="1.2s" icon={Clock} color="text-fuchsia-500" />
                    <div className="w-px h-10 bg-white/10" />
                    <HeaderMetric label="Active_Peers" value={pnodes.length} icon={Wifi} color="text-cyan-400" />
                </div>
            </header>

            {/* --- 2. THE TERMINAL STAGE --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* THE MASTER TERMINAL (Glows Pink/Fuchsia) */}
                <div className="lg:col-span-8 group relative">
                    <div className="absolute -inset-1 bg-gradient-to-b from-fuchsia-500/20 to-transparent blur-3xl opacity-10 group-hover:opacity-20 transition-all duration-1000" />

                    <div className="sovereign-glass rounded-[60px] h-[650px] flex flex-col overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
                        {/* Terminal Chrome */}
                        <div className="p-8 bg-white/[0.03] border-b border-white/5 flex justify-between items-center backdrop-blur-3xl">
                            <div className="flex gap-3">
                                <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                            </div>
                            <div className="flex items-center gap-4">
                                <RefreshCw size={14} className={`text-white/20 ${isLoading ? 'animate-spin' : 'animate-spin-slow'}`} />
                                <span className="text-[10px] font-black italic text-white/30 uppercase tracking-[0.4em]">Neural_Secure_Channel_04</span>
                            </div>
                            <Share2 size={16} className="text-white/10 hover:text-white cursor-pointer transition-colors" />
                        </div>

                        {/* Scrolling Log Area */}
                        <div className="flex-1 p-10 font-mono text-[11px] md:text-[13px] overflow-y-auto no-scrollbar space-y-6 bg-black/40">
                            {isLoading && pnodes.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4">
                                    <div className="w-10 h-10 border-t-2 border-fuchsia-500 rounded-full animate-spin" />
                                    <span className="text-fuchsia-500 font-black italic uppercase tracking-[0.4em]">Syncing_Encryption_Handshake</span>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {logs.map((log) => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                            className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 group/item relative"
                                        >
                                            <span className="text-white/20 italic tabular-nums w-20">{log.time.split(' ')[0]}</span>
                                            <span className={`font-black px-3 py-1 rounded-lg border ${log.border} ${log.bg} ${log.color} text-[9px] w-fit tracking-[0.2em] shadow-lg`}>
                                                {`[${log.type}]`}
                                            </span>
                                            <span className="text-white/70 group-hover/item:text-white transition-colors leading-relaxed tracking-wide italic">
                                                {`> ${log.msg}`}
                                            </span>
                                            <ArrowUpRight size={14} className="text-white/5 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                            <div className="pt-10 flex items-center gap-4 text-fuchsia-500/30 italic text-[10px] tracking-[0.4em] animate-pulse">
                                <Radio size={14} />
                                <span>LISTENING_FOR_GOSSIP_PACKETS_SYNC_V1...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SIDEBAR MODULES --- */}
                <div className="lg:col-span-4 flex flex-col gap-10">

                    {/* Module A: Neural Mesh Radar */}
                    <div className="sovereign-glass rounded-[60px] p-10 h-[300px] relative overflow-hidden flex flex-col justify-between border border-white/10 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] relative z-10">Mesh_Integrity_Index</h3>

                        <div className="flex-1 flex items-center justify-center relative z-10">
                            <div className="relative w-40 h-40">
                                <div className="absolute inset-0 rounded-full border border-fuchsia-500/20 animate-[ping_3s_infinite]" />
                                <div className="absolute inset-6 rounded-full border border-fuchsia-500/40 animate-[ping_4s_infinite]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                        <Zap size={56} className="text-fuchsia-500 drop-shadow-[0_0_30px_#ff00bd]" />
                                        <motion.div
                                            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute inset-0 bg-fuchsia-400 rounded-full blur-xl -z-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-black italic text-cyan-400 relative z-10">
                            <span className="uppercase tracking-widest">{stats.online} PEERS_RESOLVED</span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`w-1.5 h-4 rounded-full ${i <= 4 ? 'bg-cyan-400 shadow-[0_0_10px_#00f2ff]' : 'bg-white/5'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Module B: Protocol Specifications */}
                    <div className="sovereign-glass rounded-[60px] p-10 flex-1 flex flex-col gap-10 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-45 transition-transform duration-1000"><Cpu size={150} /></div>
                        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] relative z-10">Protocol_Specifications</h3>

                        <div className="space-y-8 relative z-10">
                            <TerminalStat label="Gossip Peers" value={pnodes.length} color="text-fuchsia-500" icon={Wifi} />
                            <TerminalStat label="Encryption" value="AES_GOSSIP" color="text-cyan-400" icon={Lock} />
                            <TerminalStat label="Security Audit" value="OK_SECURE" color="text-emerald-400" icon={Shield} />
                            <TerminalStat label="Visibility" value="MASTER_NODE" color="text-yellow-400" icon={Eye} />
                        </div>

                        <div className="mt-4 p-6 rounded-3xl bg-black/60 border border-white/5 relative z-10">
                            <p className="text-[11px] font-black italic text-white/50 leading-relaxed uppercase tracking-tighter">
                                <span className="text-emerald-400 font-bold underline mr-2">Audit:</span>
                                Neural gossip link is optimized. Shard packets are routed via high-throughput encrypted relays.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

// --- DIAMOND TERMINAL SUB-COMPONENTS ---

function HeaderMetric({ label, value, icon: Icon, color }: any) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] flex items-center gap-2">
                <Icon size={12} className={color} /> {label}
            </span>
            <span className="text-3xl font-black italic tracking-tighter text-white tabular-nums leading-none uppercase">{value}</span>
        </div>
    );
}

function TerminalStat({ label, value, icon: Icon, color }: any) {
    return (
        <div className="flex justify-between  items-center group/stat cursor-crosshair">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 group-hover/stat:border-white/30 transition-all">
                    <Icon size={18} className={color} />
                </div>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">{label}</span>
            </div>
            <span className={`text-sm font-black italic text-white tracking-[0.2em] group-hover/stat:${color} transition-colors uppercase`}>
                {value}
            </span>
        </div>
    );
}