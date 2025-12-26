/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ShieldCheck, Filter,
    ArrowUpRight, Loader2,
    MapPin, X, ChevronDown, RotateCcw
} from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';
import Headline from '@/app/components/Headline';
import Link from 'next/link';

// --- DATA FORMATTER ---
const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// --- PORTAL WRAPPER ---
const Portal = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), []);
    return mounted ? createPortal(children, document.body) : null;
};

// --- MODAL COMPONENT (STAYING AS REQUESTED) ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const CommandModal = ({ isOpen, onClose, children, footer }: ModalProps) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <Portal>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/95 backdrop-blur-2xl" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-[500px] max-h-[85vh] bg-[#050505] border border-white/10 flex flex-col rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-cyan-400 via-white to-fuchsia-600" />
                            <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-cyan-400 via-white to-fuchsia-600" />
                            <div className="px-10 flex justify-end">
                                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-white/40 hover:text-cyan-400 transition-all z-50"><X size={28} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">{children}</div>
                            {footer && <div className="p-10 border-t border-white/5 bg-black/40">{footer}</div>}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Portal>
    );
};

// --- MAIN REGISTRY ---
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
        <div className="flex flex-col gap-12 pb-20 max-w-7xl  mx-auto overflow-visible">

            {/* --- 1. DIAMOND HEADER --- */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 pt-10 border-b border-white/5 pb-12">
                <Headline title="NETWORK" title2="REGISTRY" subtitle="VERIFIED NODE ECOSYSTEM LEDGER" />
                <div className="flex items-center gap-5 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:w-96">
                        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl group-focus-within:bg-cyan-500/15 transition-all" />
                        <div className="relative flex items-center bg-black/60 border border-white/10 rounded-[28px] p-1.5 focus-within:border-cyan-500/50 transition-all shadow-2xl">
                            <div className="pl-5 pr-2 text-cyan-400/40"><Search size={22} /></div>
                            <input
                                type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                placeholder="ENTER_IDENTITY..."
                                className="bg-transparent w-full h-14 text-sm font-black italic tracking-widest text-white focus:outline-none placeholder:text-white/10 uppercase"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="h-16 px-10 rounded-[28px] sovereign-glass border border-white/10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] hover:border-cyan-500/50 transition-all group overflow-hidden relative shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <Filter size={18} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
                        <span>Filter_Nodes</span>
                    </button>
                </div>
            </header>

            {/* --- 2. THE DIAMOND LEDGER TABLE --- */}
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
            {/* --- 3. DATA SCIENCE INSIGHT STRIP --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InsightMini label="CORE_OCCUPANCY" value={`${((filteredNodes.length / (pnodes.length || 1)) * 100).toFixed(1)}%`} color="emerald" />
                <InsightMini label="SYNC_INTEGRITY" value="MASTER_STABLE" color="cyan" />
                <InsightMini label="GOSSIP_VELOCITY" value="12.4ms" color="fuchsia" />
            </div>

            {/* --- 4. MODAL LOGIC (Portal Based) --- */}
            <CommandModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                title="Refine"
                subtitle="Protocol_Settings"
                footer={
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => { setActiveStatus("ALL"); setActiveRegion("All Regions"); }}
                            className="w-full h-14 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white flex items-center justify-center gap-3 transition-all"
                        >
                            <RotateCcw size={16} /> Reset_Terminal
                        </button>
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full h-16 rounded-[25px] bg-linear-to-r from-cyan-400 via-white to-blue-600 text-black font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                        >
                            Apply_Commit
                        </button>
                    </div>
                }
            >
                <div className="space-y-12">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Status_Sector</p>
                        <div className="grid grid-cols-2 gap-3">
                            {["ALL", "ONLINE", "SYNCING", "OFFLINE"].map(s => (
                                <button
                                    key={s} onClick={() => setActiveStatus(s)}
                                    className={`py-5 rounded-[22px] text-[10px] font-black tracking-widest transition-all border 
                                    ${activeStatus === s ? 'bg-white text-black border-white shadow-[0_0_20px_#fff]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 relative group">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Geographic_Region</p>
                        <select
                            value={activeRegion}
                            onChange={(e) => setActiveRegion(e.target.value)}
                            className="w-full h-16 bg-black border border-white/10 rounded-[25px] px-8 text-xs font-black italic text-white outline-none focus:border-cyan-500 appearance-none shadow-2xl"
                        >
                            {regions.map((r: any) => <option key={r} value={r} className="bg-black">{r}</option>)}
                        </select>
                        <ChevronDown className="absolute right-6 top-[70%] -translate-y-1/2 text-white/20 pointer-events-none group-hover:text-cyan-400 transition-colors" size={20} />
                    </div>
                </div>
            </CommandModal>

        </div>
    );
}

// --- SUB-COMPONENTS (Diamond Tier) ---

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
        emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
        cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5 shadow-[0_0_30px_rgba(0,242,255,0.1)]",
        fuchsia: "text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/5 shadow-[0_0_30px_rgba(255,0,189,0.1)]"
    };
    return (
        <div className="sovereign-glass rounded-[50px] p-12 border-white/5 flex flex-col gap-3 group hover:border-white/20 hover:scale-[1.02] transition-all">
            <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em]">{label}</span>
            <span className={`text-4xl md:text-5xl font-black italic tracking-tighter leading-none ${themes[color].split(' ')[0]}`}>{value}</span>
        </div>
    );
}