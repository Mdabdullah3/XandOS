/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ShieldCheck, Globe, Filter,
    ArrowUpRight, Copy, AlertTriangle, Loader2,
    Database, Activity, Zap, Clock, MapPin, X, ChevronDown, RotateCcw, Fingerprint
} from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';
import Headline from '@/app/components/Headline';

// --- DATA FORMATTER ---
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
        <div className="flex flex-col gap-12 pb-40 max-w-7xl mx-auto overflow-visible">

            {/* --- 1. SOVEREIGN HEADER --- */}
            <header className="flex flex-col lg:flex-row justify-between items-center lg:items-center gap-8 pt-10 border-b border-white/5 pb-10">
                <Headline title="Network" title2="Registry" subtitle="Verified Node Ecosystem Ledger" />


                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    {/* DIAMOND SEARCH */}
                    <div className="relative group flex-1 lg:w-96">
                        <div className="absolute inset-0 bg-cyan-500/5 blur-2xl group-focus-within:bg-cyan-500/15 transition-all" />
                        <div className="relative flex items-center border border-white/10 rounded-[25px] focus-within:border-cyan-500/50 transition-all">
                            <div className="pl-5 pr-2 text-cyan-400/40"><Search size={20} /></div>
                            <input
                                type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                placeholder="ENTER_PROTOCOL_IDENTITY..."
                                className="bg-transparent w-full h-16 text-xs font-black italic tracking-widest text-white focus:outline-none placeholder:text-white/10 uppercase"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="h-16 px-8 rounded-[25px] sovereign-glass border border-white/10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] hover:border-cyan-500/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <Filter size={18} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
                        <span className="relative z-10">Advanced_Filters</span>
                    </button>
                </div>
            </header>

            {/* --- 2. THE REFRACTIVE LEDGER TABLE --- */}
            <div className="sovereign-glass rounded-[60px] border-white/10 overflow-hidden relative shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1300px]">
                        <thead className="bg-white/[0.03] text-[10px] font-black text-white/30 uppercase tracking-[0.4em] border-b border-white/10">
                            <tr>
                                <th className="px-10 py-10">Neural_Identity</th>
                                <th className="px-10 py-10">Address</th>
                                <th className="px-10 py-10">Location</th>
                                <th className="px-10 py-10 text-center">Integrity</th>
                                <th className="px-10 py-10">Memory_Allocation</th>
                                <th className="px-10 py-10">Status</th>
                                <th className="px-10 py-10 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr><td colSpan={7} className="py-40 text-center"><Loader2 className="animate-spin text-cyan-400 mx-auto" size={48} /></td></tr>
                            ) : currentNodes.length === 0 ? (
                                <tr><td colSpan={7} className="py-40 text-center text-white/10 uppercase tracking-[1em] italic">No_Segments_Found</td></tr>
                            ) : (
                                currentNodes.map((pod, i) => (
                                    <LedgerRow key={pod.pubkey} pod={pod} index={(currentPage - 1) * nodesPerPage + i} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* TABLE FOOTER */}
                <div className="p-10 border-t border-white/5 bg-black/40 flex justify-between items-center backdrop-blur-3xl">
                    <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">
                        Segments_Sync: <span className="text-cyan-400">{filteredNodes.length} Matches</span>
                    </span>
                    <div className="flex gap-6 items-center">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-14 px-8 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 disabled:opacity-5 transition-all">Prev_Sect</button>
                        <span className="text-sm font-black italic text-white">{currentPage} <span className="text-white/20 mx-2">/</span> {totalPages}</span>
                        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-14 px-8 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 disabled:opacity-5 transition-all">Next_Sect</button>
                    </div>
                </div>
            </div>

            {/* --- 3. FILTER MODAL --- */}
            <AnimatePresence>
                {isFilterOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsFilterOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-xl sovereign-glass rounded-[60px] p-12 border border-cyan-500/20 shadow-[0_0_100px_rgba(0,242,255,0.2)]">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter leading-none">Refine_Ecosystem</h2>
                                    <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-2 ml-1">Protocol Filtering Hub</p>
                                </div>
                                <button onClick={() => setIsFilterOpen(false)} className="p-4 bg-white/5 rounded-3xl hover:bg-white/10 transition-all text-white/40"><X size={24} /></button>
                            </div>

                            <div className="space-y-12">
                                <FilterSection label="Status_Sector">
                                    <div className="flex flex-wrap gap-4">
                                        {["ALL", "ONLINE", "SYNCING", "OFFLINE"].map(s => (
                                            <button key={s} onClick={() => setActiveStatus(s)} className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all border ${activeStatus === s ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_30px_rgba(0,242,255,0.4)]' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'}`}>{s}</button>
                                        ))}
                                    </div>
                                </FilterSection>

                                <FilterSection label="Geographic_Distribution">
                                    <div className="relative group">
                                        <select value={activeRegion} onChange={(e) => setActiveRegion(e.target.value)} className="w-full h-16 bg-black/60 border border-white/10 rounded-[25px] px-8 text-xs font-black italic text-white outline-none focus:border-pink-500 appearance-none transition-all cursor-pointer">
                                            {regions.map(r => <option key={r} value={r} className="bg-[#080C14]">{r}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-pink-500 transition-colors" size={20} />
                                    </div>
                                </FilterSection>

                                <div className="flex gap-4 pt-6">
                                    <button onClick={() => { setActiveStatus("ALL"); setActiveRegion("All Regions"); }} className="flex-1 h-16 rounded-[25px] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"><RotateCcw size={16} /> Reset</button>
                                    <button onClick={() => setIsFilterOpen(false)} className="flex-[2] h-16 rounded-[25px] bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black uppercase tracking-widest text-[11px] shadow-[0_20px_40px_rgba(0,242,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">Commit_Protocol_Filters</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- 4. DATA SCIENCE STRIP --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        <motion.tr
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 8) * 0.04 }}
            className="group hover:bg-cyan-500/[0.04] transition-all duration-500 cursor-pointer relative"
        >
            {/* Identity with Glint Icon */}
            <td className="px-10 py-8">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center relative z-10 group-hover:border-cyan-500/50 transition-all overflow-hidden shadow-2xl">
                            <ShieldCheck size={24} className={isOnline ? "text-cyan-400 drop-shadow-[0_0_8px_#00f2ff]" : "text-white/10"} />
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-black text-white italic group-hover:text-cyan-400 transition-colors uppercase tracking-tighter leading-none mb-1">Node {pod.pubkey?.slice(0, 4)}</span>
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{pod.pubkey?.slice(0, 8)}...{pod.pubkey?.slice(-4)}</span>
                    </div>
                </div>
            </td>

            <td className="px-10 py-8 text-[11px] font-mono text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-tighter">
                {pod.address || "Encrypted_Addr"}
            </td>

            <td className="px-10 py-8">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-pink-500" />
                    <span className="text-[11px] font-black italic text-white/60 uppercase tracking-widest">{pod.region || "Global_Node"}</span>
                </div>
            </td>

            <td className="px-10 py-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div initial={{ width: 0 }} animate={{ width: isOnline ? "100%" : "20%" }} className={`h-full ${isOnline ? 'bg-cyan-500 shadow-[0_0_15px_#00f2ff]' : 'bg-red-500'}`} />
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{isOnline ? 'Authenticated' : 'Offline'}</span>
                </div>
            </td>

            {/* Memory Bar with Liquid Glow */}
            <td className="px-10 py-8">
                <div className="flex flex-col gap-3 w-56">
                    <div className="flex justify-between items-center text-[10px] font-black italic uppercase tracking-widest">
                        <span className="text-white/60">{formatBytes(pod.storageUsed)} <span className="text-[8px] opacity-40">USED</span></span>
                        <span className="text-cyan-400">{formatBytes(pod.storageCapacity)} <span className="text-[8px] opacity-40 text-white">MAX</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-[2px] border border-white/10 shadow-inner relative group-hover:border-cyan-500/30 transition-all">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${storagePercent > 0 ? storagePercent : 8}%` }}
                            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 rounded-full shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                        />
                    </div>
                </div>
            </td>

            <td className="px-10 py-8">
                <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all ${isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{pod.status || 'Offline'}</span>
                </div>
            </td>

            <td className="px-10 py-8 text-right">
                <button className="p-4 rounded-[20px] sovereign-glass border border-white/10 text-white/20 hover:text-cyan-400 group-hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all shadow-xl">
                    <ArrowUpRight size={22} />
                </button>
            </td>
        </motion.tr>
    );
}

function FilterSection({ label, children }: any) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">{label}</label>
            {children}
        </div>
    );
}

function InsightMini({ label, value, color }: any) {
    const themes: any = {
        emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
        cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5 shadow-[0_0_30px_rgba(0,242,255,0.1)]",
        fuchsia: "text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/5 shadow-[0_0_30px_rgba(255,0,189,0.1)]"
    };
    return (
        <div className="sovereign-glass rounded-[40px] p-10 border-white/5 flex flex-col gap-2 group hover:border-white/20 transition-all">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{label}</span>
            <span className={`text-4xl font-black italic tracking-tighter leading-none ${themes[color].split(' ')[0]}`}>{value}</span>
        </div>
    );
}