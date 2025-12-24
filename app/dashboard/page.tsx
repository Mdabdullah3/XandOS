/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap, Activity, HardDrive, Server, ShieldCheck,
    Database, Fingerprint, ArrowUpRight, ArrowDownRight,
    Globe, Binary, Radio, Gauge, Box,
    Clock
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, Cell, LineChart, Line
} from 'recharts';
import { useXandStore } from '../store/useXandStore';
import Headline from '../components/Headline';

export default function DiamondDashboard() {
    const { pnodes, stats, fetchPNodes, isLoading } = useXandStore();

    useEffect(() => {
        fetchPNodes();
        const interval = setInterval(fetchPNodes, 15000);
        return () => clearInterval(interval);
    }, [fetchPNodes]);

    const formatStorage = (bytes: number) => {
        if (!bytes || bytes === 0) return "0.00 GB";
        const gb = bytes / 1e9;
        return gb < 1000 ? `${gb.toFixed(2)} GB` : `${(gb / 1000).toFixed(2)} TB`;
    };

    const analytics = useMemo(() => {
        if (!pnodes || pnodes.length === 0) return { topStorage: [], distribution: [] };
        const topStorage = [...pnodes]
            .sort((a, b) => (b.storageCapacity || 0) - (a.storageCapacity || 0))
            .slice(0, 8)
            .map(n => ({
                name: n.pubkey?.slice(0, 4) + ".." + n.pubkey?.slice(-4),
                capacity: Number(((n.storageCapacity || 0) / 1e9).toFixed(2)),
            }));
        return { topStorage };
    }, [pnodes]);

    if (isLoading && (!pnodes || pnodes.length === 0)) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#010103]">
                <div className="relative flex flex-col items-center gap-4">
                    <div className="w-32 h-32 border border-white/5 rounded-full flex items-center justify-center">
                        <div className="w-24 h-24 border-t-2 border-cyan-400 rounded-full animate-spin" />
                    </div>
                    <span className="text-white font-black italic tracking-[1em] text-[10px] animate-pulse">AUTHORIZING_ACCESS</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12  pb-40 max-w-7xl mx-auto overflow-hidden">

            {/* --- 1. SOVEREIGN HEADER --- */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pt-10 border-b border-white/5 pb-10">
                <Headline title="Network" title2="Sovereignty" subtitle="Next-Gen Storage Protocol Intelligence" />
            

                <div className="flex gap-12 px-10 py-6 sovereign-glass rounded-[40px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <HeaderMetric label="Global Uptime" value="99.98%" icon={Activity} color="emerald" />
                    <HeaderMetric label="Epoch Progress" value="Epoch 14" icon={Clock} color="cyan" />
                    <HeaderMetric label="Network Sync" value="Stable" icon={Zap} color="fuchsia" />
                </div>
            </header>

            {/* --- 2. THE MONOLITH KPI GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <DiamondCard
                    label="Connected Network Nodes"
                    value={stats.totalNodes}
                    delta="+5.4%"
                    icon={Server}
                    color="cyan"
                />
                <DiamondCard
                    label="Active Storage Units"
                    value={stats.online}
                    delta="Verified"
                    icon={Box}
                    color="fuchsia"
                />
                <DiamondCard
                    label="Cumulative Capacity"
                    value={formatStorage(stats.totalStorage)}
                    delta="+0.18 EB"
                    icon={Database}
                    color="emerald"
                />
            </div>

            {/* --- 3. ANALYTICS ENGINE (The "Diamond" Charts) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* PRIMARY CHART: CAPACITY RANKING */}
                <div className="lg:col-span-8 group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-white/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="sovereign-glass rounded-[60px] p-12 h-[600px] flex flex-col border border-white/10 relative overflow-hidden shadow-2xl">
                        {/* Interactive HUD Layer */}
                        <div className="flex justify-between items-start mb-16 relative z-10">
                            <div className="space-y-2">
                                <h3 className="text-cyan-400 text-[10px] font-black tracking-[0.6em] uppercase">Market_Storage_Depth</h3>
                                <p className="text-3xl font-black text-white italic tracking-tighter uppercase">Top Node <span className="text-white/20">Performance</span> Analysis</p>
                            </div>
                            <div className="p-4 rounded-[25px] bg-black/40 border border-white/10 text-white animate-pulse">
                                <Radio size={24} className="text-cyan-400" />
                            </div>
                        </div>

                        <div className="flex-1 w-full relative z-10 -ml-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.topStorage}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 11, fontWeight: '900' }} angle={-45} textAnchor="end" height={80} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 11 }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                    <Bar dataKey="capacity" radius={[12, 12, 0, 0]} barSize={50}>
                                        {analytics.topStorage.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#00f2ff' : '#1a1a2e'} stroke={index === 0 ? '#fff' : 'none'} strokeWidth={1} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* SECONDARY HUD: CONSENSUS MONITOR */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                    <div className="sovereign-glass rounded-[60px] p-10 flex flex-col flex-1 border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Binary size={150} /></div>
                        <h3 className="text-fuchsia-500 text-[10px] font-black tracking-[0.5em] uppercase mb-12">Consensus_Live</h3>

                        <div className="flex-1 flex flex-col justify-center gap-10">
                            <MetricRow label="Throughput" value="850.4 GB/s" color="text-cyan-400" />
                            <MetricRow label="Validator Load" value="42.8%" color="text-fuchsia-500" />
                            <MetricRow label="Block Latency" value="12ms" color="text-emerald-400" />
                        </div>

                        <div className="mt-12 p-6 rounded-[30px] bg-black/40 border border-white/5">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase mb-2">
                                <ShieldCheck size={14} className="text-emerald-500" /> Security_Audit
                            </div>
                            <p className="text-[11px] text-white/40 leading-relaxed font-medium italic">
                                Encryption handshake verified across <span className="text-white font-bold">235 nodes</span>. Network state remains immutable.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- DIAMOND COMPONENTS ---

function DiamondCard({ label, value, delta, icon: Icon, color }: any) {
    const themes: any = {
        cyan: "text-cyan-400 shadow-[0_0_40px_rgba(0,242,255,0.1)] border-cyan-400/20 bg-cyan-400/5",
        fuchsia: "text-fuchsia-500 shadow-[0_0_40px_rgba(255,0,189,0.1)] border-fuchsia-500/20 bg-fuchsia-500/5",
        emerald: "text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.1)] border-emerald-400/20 bg-emerald-400/5",
    };

    return (
        <div className="sovereign-glass rounded-[50px] p-12 flex flex-col border border-white/10 relative overflow-hidden group hover:scale-[1.02] transition-all duration-700 cursor-pointer">
            <div className="flex justify-between items-start mb-12 relative z-10">
                <div className={`p-5 rounded-[25px] bg-transparent border border-white/10 ${themes[color].split(' ')[0]}`}>
                    <Icon size={32} strokeWidth={1.5} />
                </div>
                <div className={`px-4 py-1.5 rounded-full bg-black border text-[11px] font-black italic tracking-widest ${themes[color].split(' ')[0]}`}>
                    {delta}
                </div>
            </div>
            <div className="space-y-2 relative z-10">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">{label}</span>
                <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] uppercase">
                    {value}
                </h2>
            </div>
            {/* Reflective Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
    );
}

function HeaderMetric({ label, value, icon: Icon, color }: any) {
    const colorMap: any = { cyan: "text-cyan-400", emerald: "text-emerald-400", fuchsia: "text-fuchsia-500" };
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                <Icon size={12} className={colorMap[color]} /> {label}
            </span>
            <span className="text-2xl font-black italic tracking-tighter text-white leading-none">{value}</span>
        </div>
    );
}

function MetricRow({ label, value, color }: any) {
    return (
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{label}</span>
            <span className={`text-2xl font-black italic tracking-tighter uppercase ${color}`}>{value}</span>
        </div>
    );
}

function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,1)] border-t-2 border-t-cyan-400">
                <p className="text-[11px] font-black text-white/40 uppercase mb-4 tracking-[0.4em]">Audit_Report_Verified</p>
                <p className="text-4xl font-black text-white italic leading-none">{payload[0].value} <span className="text-sm font-bold text-cyan-400">GB</span></p>
                <p className="text-[10px] font-mono text-white/20 mt-4 uppercase tracking-tighter">Verified Identity: {payload[0].payload.name}</p>
            </div>
        );
    }
    return null;
}