/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ShieldCheck, Filter,
    ArrowUpRight, Loader2,
    MapPin, X, ChevronDown, RotateCcw
} from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';
import Headline from '@/app/components/Headline';
import Link from 'next/link';

const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function NodeRegistry() {
    const { pnodes, fetchPNodes, isLoading } = useXandStore();
    const [search, setSearch] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeStatus, setActiveStatus] = useState("ALL");
    const [activeRegion, setActiveRegion] = useState("All Regions");
    const [currentPage, setCurrentPage] = useState(1);
    const nodesPerPage = 8;

    useEffect(() => { fetchPNodes(); }, [fetchPNodes]);

    const regions = useMemo(() => {
        const unique = new Set(pnodes.map((n: any) => n.region).filter(Boolean));
        return ["All Regions", ...Array.from(unique)];
    }, [pnodes]);

    const filteredNodes = useMemo(() => {
        return pnodes.filter((node: any) => {
            const matchesSearch = node.pubkey?.toLowerCase().includes(search.toLowerCase()) || node.address?.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = activeStatus === "ALL" || node.status?.toUpperCase() === activeStatus;
            const matchesRegion = activeRegion === "All Regions" || node.region === activeRegion;
            return matchesSearch && matchesStatus && matchesRegion;
        });
    }, [pnodes, search, activeStatus, activeRegion]);

    const currentNodes = filteredNodes.slice((currentPage - 1) * nodesPerPage, currentPage * nodesPerPage);
    const totalPages = Math.ceil(filteredNodes.length / nodesPerPage);

    return (
        <div className="flex flex-col gap-8 md:gap-12 pb-40 max-w-7xl mx-auto overflow-visible">

            {/* --- 1. SOVEREIGN HEADER --- */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 pt-4 md:pt-6 border-b border-white/5 pb-10 px-4 md:px-0">
                <div className="scale-90 sm:scale-100 origin-left">
                    <Headline title="Network" title2="Registry" subtitle="Verified Node Ecosystem Ledger" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative group w-full sm:w-80 lg:w-96">
                        <div className="absolute inset-0 bg-cyan-500/5 blur-2xl group-focus-within:bg-cyan-500/15 transition-all duration-700 " />
                        <div className="relative p-px flex items-center bg-transparent border border-white/10 rounded-[20px] md:rounded-[25px] focus-within:border-cyan-500/50 transition-all">
                            <div className="pl-4 md:pl-5 pr-2 text-cyan-400/40"><Search size={22} /></div>
                            <input
                                type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                placeholder="SEARCH_ID..."
                                className="bg-transparent w-full h-12 md:h-14 text-[10px] md:text-xs font-black italic tracking-widest text-white focus:outline-none placeholder:text-white/10 uppercase"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="h-14 md:h-16 px-6 md:px-8 rounded-[20px] md:rounded-[25px] sovereign-glass border border-white/10 flex items-center justify-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:border-cyan-500/50 transition-all group overflow-hidden w-full md:w-auto"
                    >
                        <Filter size={18} className="text-cyan-400" />
                        <span>Filter_Sector</span>
                    </button>
                </div>
            </header>

            {/* --- 2. THE LEDGER TABLE --- */}
            <div className="sovereign-glass rounded-[30px] md:rounded-[60px] border-white/10 overflow-hidden relative shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1100px] lg:min-w-full table-fixed">
                        <thead className="bg-white/3 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] border-b border-white/10">
                            <tr>
                                <th className="px-8 py-10 w-[22%]">Identity</th>
                                <th className="px-8 py-10 w-[15%]">Address</th>
                                <th className="px-8 py-10 w-[15%] text-center">Location</th>
                                <th className="px-8 py-10 w-[12%] text-center">Integrity</th>
                                <th className="px-8 py-10 w-[20%] text-center">Allocation</th>
                                <th className="px-8 py-10 w-[11%]">Status</th>
                                <th className="px-8 py-10 w-[5%]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr><td colSpan={7} className="py-40 text-center"><Loader2 className="animate-spin text-cyan-400 mx-auto" size={40} /></td></tr>
                            ) : currentNodes.map((pod: any, i: number) => (
                                <LedgerRow key={pod.pubkey} pod={pod} index={(currentPage - 1) * nodesPerPage + i} />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-white/5 bg-black/40 flex flex-col sm:flex-row gap-6 justify-between items-center backdrop-blur-3xl">
                    <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">
                        Segments_Sync: <span className="text-cyan-400">{filteredNodes.length} Matches</span>
                    </span>
                    <div className="flex gap-6 items-center">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-14 px-8 rounded-2xl border border-white/10 text-[10px] font-black uppercase text-white/40 hover:text-cyan-400 disabled:opacity-5 transition-all">Prev</button>
                        <span className="text-sm font-black italic text-white">{currentPage} <span className="text-white/20 mx-2">/</span> {totalPages}</span>
                        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-14 px-8 rounded-2xl border border-white/10 text-[10px] font-black uppercase text-white/40 hover:text-cyan-400 disabled:opacity-5 transition-all">Next</button>
                    </div>
                </div>
            </div>

            {/* --- 3. DYNAMIC SIDE-DRAWER FILTER (Full Height) --- */}
            <AnimatePresence>
                {isFilterOpen && (
                    <div className="fixed inset-0 z-600 flex justify-end">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsFilterOpen(false)}
                        />

                        {/* The Drawer */}
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-[400px] h-screen bg-[#010103] border-l border-white/10 shadow-[-50px_0_100px_rgba(0,0,0,0.9)] flex flex-col"
                        >
                            {/* Prism Edge Bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-linear-to-b from-cyan-400 via-white to-fuchsia-600" />

                            {/* Header */}
                            <div className="p-10 border-b border-white/5 bg-white/2">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Filters</h2>
                                    <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40"><X size={20} /></button>
                                </div>
                                <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em]">Sector_Refinement_Protocol</p>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                                <div className="space-y-6">
                                    <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Status_Sectors</label>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        {["ALL", "ONLINE", "SYNCING", "OFFLINE"].map(s => (
                                            <button
                                                key={s} onClick={() => setActiveStatus(s)}
                                                className={`py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all border 
                                                    ${activeStatus === s ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Regional_Sharding</label>
                                    <div className="relative group mt-1">
                                        <select
                                            value={activeRegion}
                                            onChange={(e) => setActiveRegion(e.target.value)}
                                            className="w-full h-16 bg-black border border-white/10 rounded-[25px] px-8 text-xs font-black italic text-white outline-none focus:border-cyan-500 appearance-none transition-all cursor-pointer shadow-inner"
                                        >
                                            {regions.map((r: any) => <option key={r} value={r} className="bg-[#080C14]">{r}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-cyan-400 transition-colors pointer-events-none" size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer Actions */}
                            <div className="p-10 border-t border-white/5 bg-black">
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => { setActiveStatus("ALL"); setActiveRegion("All Regions"); }}
                                        className="w-full h-16 rounded-[25px] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all flex items-center justify-center gap-3"
                                    >
                                        <RotateCcw size={16} /> Reset_Registry
                                    </button>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="w-full h-16 rounded-[25px] bg-linear-to-r from-cyan-500 to-blue-600 text-black font-black uppercase tracking-widest text-[11px] shadow-[0_20px_40px_rgba(0,242,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Apply_Encryption_Filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- 4. INSIGHT STRIP --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                <InsightMini label="Network_Occupancy" value={`${((filteredNodes.length / (pnodes.length || 1)) * 100).toFixed(1)}%`} color="emerald" />
                <InsightMini label="Sync_Integrity" value="Master_Stable" color="cyan" />
                <InsightMini label="Latency_Average" value="12.4ms" color="fuchsia" />
            </div>

        </div>
    );
}

// --- SUB-COMPONENTS ---

function LedgerRow({ pod, index }: any) {
    const isOnline = pod.status === 'online';
    const storagePercent = (pod.storageUsed / pod.storageCapacity * 100) || 0;

    return (
        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (index % 8) * 0.03 }} className="group hover:bg-cyan-500/4 transition-all cursor-pointer relative">
            <td className="px-8 py-8">
                <Link href={`/dashboard/nodes/${pod?.pubkey}`} className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-[22px] bg-linear-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-500 transition-all">
                        <ShieldCheck size={24} className={isOnline ? "text-cyan-400" : "text-white/10"} />
                        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-black text-white italic group-hover:text-cyan-400 transition-colors uppercase tracking-tight">Node {pod.pubkey?.slice(0, 4)}</span>
                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">{pod.pubkey?.slice(0, 8)}...</span>
                    </div>
                </Link>
            </td>
            <td className="px-8 py-8 text-[11px] font-mono text-white/30 truncate uppercase tracking-widest">{pod.address || "Encrypted"}</td>
            <td className="px-8 py-8 text-center">
                <div className="flex items-center justify-center gap-2">
                    <MapPin size={14} className="text-pink-500" />
                    <span className="text-[11px] font-black italic text-white/60 uppercase">{pod.region || "G_NODE"}</span>
                </div>
            </td>
            <td className="px-8 py-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div initial={{ width: 0 }} animate={{ width: isOnline ? "100%" : "20%" }} className={`h-full ${isOnline ? 'bg-cyan-500 shadow-[0_0_15px_#00f2ff]' : 'bg-rose-600'}`} />
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase">Auth_Level_03</span>
                </div>
            </td>
            <td className="px-8 py-8">
                <div className="flex flex-col gap-3 w-full max-w-64 mx-auto">
                    <div className="flex justify-between items-center text-[10px] font-black italic uppercase tracking-widest">
                        <span className="text-white/60">{formatBytes(pod.storageUsed)}</span>
                        <span className="text-cyan-400">{formatBytes(pod.storageCapacity)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-[2px] border border-white/10 shadow-2xl">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${storagePercent > 0 ? storagePercent : 8}%` }} className="h-full bg-linear-to-r from-cyan-400 via-blue-500 to-fuchsia-500 rounded-full shadow-[0_0_20px_rgba(0,242,255,0.4)]" />
                    </div>
                </div>
            </td>
            <td className="px-8 py-8">
                <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all ${isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 border-rose-500/30 text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{pod.status || 'Offline'}</span>
                </div>
            </td>
            <td className="text-right pr-10">
                <Link href={`/dashboard/nodes/${pod.pubkey}`} className="hover:text-white text-cyan-400 transition-all"><ArrowUpRight size={24} /></Link>
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
        <div className="sovereign-glass rounded-[40px] p-10 border-white/5 flex flex-col gap-2 group hover:border-white/20 hover:scale-[1.02] transition-all">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{label}</span>
            <span className={`text-3xl md:text-5xl font-black italic tracking-tighter leading-none ${themes[color].split(' ')[0]}`}>{value}</span>
        </div>
    );
}