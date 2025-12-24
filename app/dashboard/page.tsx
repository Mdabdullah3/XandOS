/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { Zap, Activity, HardDrive, Server, ShieldCheck, Database, Fingerprint, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { useXandStore } from '../store/useXandStore';

export default function SovereignOverview() {
    const { pnodes, stats, fetchPNodes, isLoading } = useXandStore();

    useEffect(() => {
        fetchPNodes();
        const interval = setInterval(fetchPNodes, 15000);
        return () => clearInterval(interval);
    }, [fetchPNodes]);

    // --- UNIT FORMATTER HELPER ---
    const formatStorage = (bytes: number) => {
        if (!bytes || bytes === 0) return "0.00 GB";
        const gb = bytes / 1e9;
        if (gb < 1000) return `${gb.toFixed(2)} GB`;
        return `${(gb / 1000).toFixed(2)} TB`;
    };

    const analytics = useMemo(() => {
        if (!pnodes || pnodes.length === 0) return { topStorage: [], distribution: [] };

        // 1. Top 10 Nodes - Use GB if values are small for better bar height
        const topStorage = [...pnodes]
            .sort((a, b) => (b.storageCapacity || 0) - (a.storageCapacity || 0))
            .slice(0, 10)
            .map(n => ({
                name: n.pubkey ? (n.pubkey.slice(0, 4) + ".." + n.pubkey.slice(-4)) : "Unknown",
                capacity: Number(((n.storageCapacity || 0) / 1e9).toFixed(2)), // Chart in GB for visibility
            }));

        // 2. Distribution logic
        const distribution = [
            { range: '0-100G', count: pnodes.filter((n: { storageCapacity: number; }) => n.storageCapacity < 1e11).length },
            { range: '100-500G', count: pnodes.filter((n: { storageCapacity: number; }) => (n.storageCapacity >= 1e11 && n.storageCapacity < 5e11)).length },
            { range: '500G-1T', count: pnodes.filter((n: { storageCapacity: number; }) => (n.storageCapacity >= 5e11 && n.storageCapacity < 1e12)).length },
            { range: '1T-10T', count: pnodes.filter((n: { storageCapacity: number; }) => (n.storageCapacity >= 1e12 && n.storageCapacity < 1e13)).length },
            { range: '10T+', count: pnodes.filter((n: { storageCapacity: number; }) => n.storageCapacity >= 1e13).length },
        ];

        return { topStorage, distribution };
    }, [pnodes]);

    if (isLoading && (!pnodes || pnodes.length === 0)) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 border-t-2 border-cyan-500 rounded-full animate-spin shadow-[0_0_30px_#00f2ff]" />
                <p className="text-cyan-400 font-black italic uppercase tracking-[0.5em] text-sm animate-pulse">Syncing_Mainnet_Gossip</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 px-6 pb-40 max-w-[1700px] mx-auto">

            {/* 1. HEADER */}
            <header className="flex justify-between items-end pt-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-black tracking-[0.4em] uppercase">
                        <ShieldCheck size={14} /> System_Authenticated
                    </div>
                    <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                        Apex<span className="text-cyan-400">_Pulse</span>
                    </h1>
                </div>
            </header>

            {/* 2. KPI STRIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ApexKPICard label="Total Network Nodes" value={stats.totalNodes} delta="+1.2%" isUp={true} icon={Server} color="cyan" />
                <ApexKPICard label="Verified Active Pods" value={stats.online} delta="ACTIVE" isUp={true} icon={Zap} color="fuchsia" />
                <ApexKPICard label="Aggregated Capacity" value={formatStorage(stats.totalStorage)} delta="+5.4%" isUp={true} icon={HardDrive} color="emerald" />
            </div>

            {/* 3. CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* CHART A */}
                <div className="sovereign-glass rounded-[50px] p-10 h-[500px] flex flex-col border-white/5 group">
                    <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Node Capacity Ranking</h3>
                            <p className="text-[9px] font-mono text-white/30 uppercase">Metric: Gigabytes (GB) / Node_ID</p>
                        </div>
                        <Database size={20} className="text-cyan-400 opacity-30" />
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.topStorage}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                <Bar dataKey="capacity" radius={[6, 6, 0, 0]}>
                                    {analytics.topStorage.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#00f2ff' : '#334155'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHART B */}
                <div className="sovereign-glass rounded-[50px] p-10 h-[500px] flex flex-col border-white/5 group">
                    <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Storage Distribution</h3>
                            <p className="text-[9px] font-mono text-white/30 uppercase">Metric: Node Count / Storage Tiers</p>
                        </div>
                        <Activity size={20} className="text-fuchsia-500 opacity-30" />
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.distribution}>
                                <defs>
                                    <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff00bd" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ff00bd" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="count" stroke="#ff00bd" strokeWidth={4} fill="url(#glowGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

function ApexKPICard({ label, value, delta, isUp, icon: Icon, color }: any) {
    const colors: any = {
        cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
        fuchsia: "text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/5",
        emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
    };

    return (
        <div className="sovereign-glass rounded-[45px] p-10 flex flex-col border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-10">
                <div className={`p-4 rounded-2xl bg-black/40 border border-white/10 ${colors[color]}`}>
                    <Icon size={28} />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 border text-[10px] font-black ${isUp ? 'text-emerald-400 border-emerald-400/20' : 'text-rose-500 border-rose-500/20'}`}>
                    {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {delta}
                </div>
            </div>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">{label}</span>
            <h2 className="text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">{value}</h2>
        </div>
    );
}

function HeaderStat({ label, value, color }: any) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-white/30 tracking-widest uppercase">{label}</span>
            <span className={`text-sm font-black italic tracking-widest ${color}`}>{value}</span>
        </div>
    );
}

function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl">
                <p className="text-[10px] font-black text-white/40 uppercase mb-2 tracking-widest">Network_Report</p>
                <p className="text-2xl font-black text-cyan-400 italic">{payload[0].value} <span className="text-xs text-white">UNIT</span></p>
                <p className="text-[9px] font-mono text-white/30 mt-1 uppercase tracking-tighter">ID: {payload[0].payload.name || "GLOBAL_CLUSTER"}</p>
            </div>
        );
    }
    return null;
}