/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import {
    Trophy, Crown, Medal, ArrowUpRight,
    ShieldCheck, Fingerprint, Loader2, Star
} from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';

// --- DATA HELPERS ---
const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const gb = bytes / 1e9;
    return gb < 1000 ? `${gb.toFixed(1)} GB` : `${(gb / 1000).toFixed(1)} TB`;
};

export default function LeaderboardPage() {
    const { pnodes, fetchPNodes, isLoading } = useXandStore();

    useEffect(() => {
        fetchPNodes();
    }, [fetchPNodes]);

    // --- DYNAMIC RANKING LOGIC ---
    const { topThree, hallOfFame } = useMemo(() => {
        // 1. Sort nodes by credits (Descending)
        const sorted = [...pnodes].sort((a, b) => (b.credits || 0) - (a.credits || 0));

        // 2. Map the Top 3 with Podium Styling
        const topThree = sorted.slice(0, 3).map((node, i) => ({
            rank: i + 1,
            id: `Node_${node.pubkey?.slice(0, 4)}`,
            pubkey: node.pubkey,
            score: node.credits || 0,
            uptime: node.status === 'online' ? "99.9%" : "84.2%",
            shards: formatBytes(node.storageCapacity),
            color: i === 0 ? "text-yellow-400" : i === 1 ? "text-cyan-400" : "text-emerald-400",
            bg: i === 0 ? "from-yellow-400/20" : i === 1 ? "from-cyan-400/20" : "from-emerald-400/20",
        }));

        // 3. Map the rest for the table
        const hallOfFame = sorted.slice(3, 15).map((node, i) => ({
            rank: i + 4,
            id: node.pubkey,
            score: node.credits || 0,
            status: node.status?.toUpperCase(),
            trend: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 5)}` : `-${Math.floor(Math.random() * 2)}`
        }));

        return { topThree, hallOfFame };
    }, [pnodes]);

    if (isLoading && pnodes.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-yellow-400" size={40} />
                <p className="text-yellow-400 font-black italic uppercase tracking-[0.5em] text-[10px]">Calculating_Global_Ranks...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 pb-40 px-4">

            {/* 1. SEASON HUD HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                        Apex<span className="text-yellow-400">_Champions</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]" />
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em]">Protocol: Performance_Leaderboard_v1</p>
                    </div>
                </div>

                <div className="flex bg-black/40 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl gap-10 items-center">
                    <div className="text-left">
                        <span className="block text-[8px] font-black text-white/30 uppercase tracking-widest">Epoch_Reset_In</span>
                        <span className="text-xl font-black italic text-white font-mono tracking-tighter uppercase">04D : 12H : 44M</span>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                        <Trophy size={20} />
                    </div>
                </div>
            </header>

            {/* 2. THE DYNAMIC PODIUM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-10">
                {/* Rank 2 (Silver) */}
                {topThree[1] && <PodiumCard node={topThree[1]} height="h-[380px]" order="order-2 md:order-1" delay={0.2} />}

                {/* Rank 1 (Gold) */}
                {topThree[0] && <PodiumCard node={topThree[0]} height="h-[480px]" order="order-1 md:order-2" delay={0} isWinner />}

                {/* Rank 3 (Bronze) */}
                {topThree[2] && <PodiumCard node={topThree[2]} height="h-[340px]" order="order-3" delay={0.4} />}
            </div>

            {/* 3. HALL OF FAME REGISTRY */}
            <div className="sovereign-glass rounded-[40px] overflow-hidden border-white/5 relative shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-3">
                        <Fingerprint size={14} className="text-cyan-400" /> System_Registry_Legacy
                    </h3>
                    <span className="text-[9px] font-mono text-cyan-400 opacity-50 uppercase tracking-widest italic">Rank_Index_Global</span>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-black/20 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                        <tr>
                            <th className="px-10 py-5">Global_Rank</th>
                            <th className="px-10 py-5">Node_Identity</th>
                            <th className="px-10 py-5">Credit_Score</th>
                            <th className="px-10 py-5">Shift_Trend</th>
                            <th className="px-10 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                        {hallOfFame.map((node, i) => (
                            <tr key={node.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                <td className="px-10 py-6">
                                    <span className="font-mono text-white/40 text-xs">#0{node.rank}</span>
                                </td>
                                <td className="px-10 py-6">
                                    <span className="font-black italic text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight text-xs">
                                        {node.id.slice(0, 12)}...{node.id.slice(-4)}
                                    </span>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-3">
                                        <Star size={12} className="text-yellow-500" fill="currentColor" />
                                        <span className="text-sm font-black italic text-white">{node.score.toLocaleString()}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <span className={`text-[10px] font-bold ${node.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {node.trend} POS
                                    </span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <button className="p-2.5 rounded-xl border border-white/5 text-white/20 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-all">
                                        <ArrowUpRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

// --- REUSABLE PODIUM CARD ---
function PodiumCard({ node, height, order, delay, isWinner }: any) {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay, ease: "circOut" }}
            className={`${height} ${order} sovereign-glass rounded-[45px] p-8 relative flex flex-col justify-between items-center group overflow-hidden border-white/10`}
        >
            <div className={`absolute inset-0 bg-gradient-to-b ${node.bg} to-transparent opacity-10 group-hover:opacity-20 transition-opacity`} />

            {isWinner && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-400/20 blur-[80px] rounded-full" />
            )}

            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center border shadow-2xl transition-transform duration-500 group-hover:scale-110 ${isWinner ? 'bg-yellow-400 border-yellow-200' : 'bg-white/5 border-white/10'}`}>
                    {isWinner ? <Crown size={32} className="text-black" /> : <Medal size={28} className={node.color} />}
                </div>
                <div className="text-center">
                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${node.color}`}>Rank_0{node.rank}</span>
                    <h3 className="text-md font-black italic text-white uppercase tracking-tighter mt-1">{node.pubkey?.slice(0, 8)}...</h3>
                </div>
            </div>

            <div className="relative w-full py-6">
                <div className="flex justify-between items-center px-4 mb-2 text-[8px] font-black text-white/40 tracking-widest uppercase">
                    <span>Performance</span>
                    <span>Status</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-black italic text-white italic tabular-nums">{node.score.toLocaleString()}</span>
                    <div className="flex-1 h-[1px] bg-white/10" />
                    <ShieldCheck size={16} className="text-emerald-400" />
                </div>
            </div>

            <div className="w-full space-y-3 relative z-10">
                <div className="flex justify-between p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Uptime_Ratio</span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{node.uptime}</span>
                </div>
                <div className="flex justify-between p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Shard_Cap</span>
                    <span className="text-xs font-mono text-fuchsia-400 font-bold">{node.shards}</span>
                </div>
            </div>
        </motion.div>
    );
}