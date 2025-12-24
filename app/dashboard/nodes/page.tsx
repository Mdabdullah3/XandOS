/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ShieldCheck, Globe, Filter,
    ArrowUpRight, Copy, AlertTriangle, Loader2,
    Database, Activity, Zap, Clock, MapPin, X, ChevronDown, RotateCcw
} from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';

// --- DATA FORMATTER ---
const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const dm = 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function NodeRegistry() {
    const { pnodes, fetchPNodes, isLoading } = useXandStore();
    const [search, setSearch] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter State
    const [activeStatus, setActiveStatus] = useState("ALL");
    const [activeRegion, setActiveRegion] = useState("All Regions");

    const [currentPage, setCurrentPage] = useState(1);
    const nodesPerPage = 8;

    useEffect(() => {
        fetchPNodes();
    }, [fetchPNodes]);

    // Dynamically get unique regions from data
    const regions = useMemo(() => {
        const unique = new Set(pnodes.map((n: any) => n.region).filter(Boolean));
        return ["All Regions", ...Array.from(unique)];
    }, [pnodes]);

    // --- ADVANCED FILTER LOGIC ---
    const filteredNodes = useMemo(() => {
        return pnodes.filter((node: any) => {
            const matchesSearch =
                node.pubkey?.toLowerCase().includes(search.toLowerCase()) ||
                node.address?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = activeStatus === "ALL" || node.status?.toUpperCase() === activeStatus;

            const matchesRegion = activeRegion === "All Regions" || node.region === activeRegion;

            return matchesSearch && matchesStatus && matchesRegion;
        });
    }, [pnodes, search, activeStatus, activeRegion]);

    const currentNodes = filteredNodes.slice((currentPage - 1) * nodesPerPage, currentPage * nodesPerPage);
    const totalPages = Math.ceil(filteredNodes.length / nodesPerPage);

    console.log(currentNodes);
    return (
        <div className="flex flex-col gap-10 pb-40 px-2 relative">

            {/* --- 1. TACTICAL HEADER & SEARCH --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                        Node<span className="text-cyan-400">_Registry</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Sector: Global_Gossip_Ledger</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-96">
                        <div className="absolute inset-0 bg-cyan-500/5 blur-xl group-focus-within:bg-cyan-500/20 transition-all" />
                        <div className="relative flex items-center bg-black/60 border border-white/10 rounded-2xl p-1 focus-within:border-cyan-500/50 transition-all">
                            <div className="pl-4 pr-2 text-white/20"><Search size={18} /></div>
                            <input
                                type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                placeholder="SEARCH_BY_PUBKEY_OR_IP..."
                                className="bg-transparent w-full h-12 text-xs font-mono text-white focus:outline-none placeholder:text-white/10 uppercase"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="h-14 px-6 rounded-2xl sovereign-glass border border-white/10 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:border-cyan-500/50 transition-all group"
                    >
                        <Filter size={16} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                        Advanced_Filters
                        {(activeStatus !== "ALL" || activeRegion !== "All Regions") && (
                            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                        )}
                    </button>
                </div>
            </div>

            {/* --- 2. THE LEDGER TABLE --- */}
            <div className="sovereign-glass rounded-[50px] border-white/5 overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead className="bg-white/[0.03] text-[10px] font-black text-white/30 uppercase tracking-[0.3em] border-b border-white/5">
                            <tr>
                                <th className="px-8 py-7">Node_Identity</th>
                                <th className="px-8 py-7">Network_Address</th>
                                <th className="px-8 py-7">Location</th>
                                <th className="px-8 py-7">Integrity_Score</th>
                                <th className="px-8 py-7">Memory_Usage</th>
                                <th className="px-8 py-7">Status</th>
                                <th className="px-8 py-7 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                            {isLoading ? (
                                <tr><td colSpan={7} className="py-32 text-center"><Loader2 className="animate-spin text-cyan-400 mx-auto" size={40} /></td></tr>
                            ) : currentNodes.length === 0 ? (
                                <tr><td colSpan={7} className="py-32 text-center text-white/20 uppercase tracking-widest italic">No matching pNodes in current shard</td></tr>
                            ) : (
                                currentNodes.map((pod, i) => (
                                    <LedgerRow key={pod.pubkey} pod={pod} index={(currentPage - 1) * nodesPerPage + i} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                        Showing {currentNodes.length} of {filteredNodes.length} Active Segments
                    </span>
                    <div className="flex gap-4 items-center">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-12 px-6 rounded-2xl border border-white/10 text-[9px] font-black uppercase text-white/40 hover:text-cyan-400 disabled:opacity-10 transition-all">Prev_Sect</button>
                        <span className="text-xs text-cyan-400 font-bold">{currentPage} / {totalPages || 1}</span>
                        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-12 px-6 rounded-2xl border border-white/10 text-[9px] font-black uppercase text-white/40 hover:text-cyan-400 disabled:opacity-10 transition-all">Next_Sect</button>
                    </div>
                </div>
            </div>

            {/* --- 3. FILTER MODAL --- */}
            <AnimatePresence>
                {isFilterOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setIsFilterOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg sovereign-glass rounded-[40px] p-10 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)]"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-2xl font-black italic text-white uppercase tracking-tight">Refine_pNodes</h2>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Adjust Protocol Filtering Parameters</p>
                                </div>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                                    <X size={20} className="text-white/40" />
                                </button>
                            </div>

                            <div className="space-y-10">
                                {/* Status Sector */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Status_Sector</label>
                                    <div className="flex flex-wrap gap-3">
                                        {["ALL", "ONLINE", "SYNCING", "OFFLINE"].map(s => (
                                            <button
                                                key={s} onClick={() => setActiveStatus(s)}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border
                                                    ${activeStatus === s ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_20px_rgba(0,242,255,0.4)]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Region Sector */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Geographic_Sharding</label>
                                    <div className="relative group">
                                        <select
                                            value={activeRegion}
                                            onChange={(e) => setActiveRegion(e.target.value)}
                                            className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-xs font-bold text-white outline-none focus:border-pink-500 appearance-none transition-all cursor-pointer"
                                        >
                                            {regions.map(r => <option key={r} value={r} className="bg-[#080C14]">{r}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-hover:text-pink-500 transition-colors" size={18} />
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => { setActiveStatus("ALL"); setActiveRegion("All Regions"); }}
                                        className="flex-1 h-14 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={14} /> Reset_Terminal
                                    </button>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black uppercase tracking-widest text-[10px] shadow-[0_15px_30px_rgba(0,242,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Apply_Protocol_Filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- 4. INSIGHT STRIP --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightMini label="Network Load" value={`${((filteredNodes.length / (pnodes.length || 1)) * 100).toFixed(1)}%`} color="emerald" />
                <InsightMini label="Protocol Drift" value="STABLE" color="cyan" />
                <InsightMini label="Sync Velocity" value="450ms" color="fuchsia" />
            </div>

        </div>
    );
}

// --- SUB-COMPONENTS ---

function LedgerRow({ pod, index }: any) {
    const isOnline = pod.status === 'online';
    const usedBytes = pod.storageUsed || 0;
    const capacityBytes = pod.storageCapacity || 0;
    const storagePercent = capacityBytes > 0 ? (usedBytes / capacityBytes) * 100 : 0;

    return (
        <motion.tr
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index % 8) * 0.05 }}
            className="group hover:bg-cyan-500/[0.03] transition-colors cursor-pointer"
        >
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center relative z-10 group-hover:border-cyan-500/50 transition-all">
                        <ShieldCheck size={20} className={isOnline ? "text-cyan-400" : "text-white/20"} />
                        {isOnline && <div className="absolute inset-0 bg-cyan-400/10 animate-pulse rounded-2xl" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-black text-white italic group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-none mb-1">
                            Node {pod.pubkey?.slice(0, 4)}
                        </span>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">({pod.pubkey?.slice(0, 6)}...{pod.pubkey?.slice(-4)})</span>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6 text-[11px] font-mono text-white/40 group-hover:text-white/80 transition-colors tracking-tighter">
                {pod.address || "MASKED_ADDR"}
            </td>
            <td className="px-8 py-6 text-white/60">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-pink-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{pod.region || "Global_Relay"}</span>
                </div>
            </td>
            <td className="px-8 py-6">
                <div className="flex flex-col gap-2">
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: isOnline ? "100%" : "30%" }} className={`h-full ${isOnline ? 'bg-cyan-500 shadow-[0_0_10px_#00f2ff]' : 'bg-red-500'}`} />
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-tighter">{isOnline ? 'VERIFIED' : 'DEGRADED'}</span>
                </div>
            </td>
            <td className="px-8 py-6">
                <div className="flex flex-col gap-2 w-48">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-white/80">{formatBytes(usedBytes)} USED</span>
                        <span className="text-cyan-400">{formatBytes(capacityBytes)} TOTAL</span>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/10 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${storagePercent > 0 ? storagePercent : 5}%` }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(0,242,255,0.4)]"
                        />
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-red-500'} `} />
                    <span className={isOnline ? 'text-emerald-400' : 'text-red-400'}>{pod.status || 'OFFLINE'}</span>
                </div>
            </td>
            <td className="px-8 py-6 text-right">
                <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/20 hover:text-cyan-400 group-hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all">
                    <ArrowUpRight size={20} />
                </button>
            </td>
        </motion.tr>
    );
}

function InsightMini({ label, value, color }: any) {
    const themes: any = {
        emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
        cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
        fuchsia: "text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/5"
    };
    return (
        <div className="sovereign-glass rounded-[32px] p-7 border-white/5 flex flex-col gap-1 items-center md:items-start group hover:border-white/20 transition-all">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{label}</span>
            <span className={`text-3xl font-black italic tracking-tighter ${themes[color].split(' ')[0]}`}>{value}</span>
        </div>
    );
}