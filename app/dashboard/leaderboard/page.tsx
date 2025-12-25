/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import {
    Trophy, Crown, Medal, ArrowUpRight,
    Fingerprint, Star,
    Zap, Box, TrendingUp
} from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';
import Headline from '@/app/components/Headline';

const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const gb = bytes / 1e9;
    return gb < 1000 ? `${gb.toFixed(1)} GB` : `${(gb / 1000).toFixed(1)} TB`;
};

export default function LeaderboardPage() {
    const { pnodes, fetchPNodes, isLoading } = useXandStore();

    useEffect(() => { fetchPNodes(); }, [fetchPNodes]);

    const { topThree, hallOfFame } = useMemo(() => {
        const sorted = [...pnodes].sort((a, b) => (b.credits || 0) - (a.credits || 0));

        const topThree = sorted.slice(0, 3).map((node, i) => ({
            rank: i + 1,
            pubkey: node.pubkey,
            score: node.credits || 0,
            uptime: node.status === 'online' ? "99.9%" : "84.2%",
            shards: formatBytes(node.storageCapacity),
            color: i === 0 ? "text-yellow-400" : i === 1 ? "text-cyan-400" : "text-fuchsia-400",
            glow: i === 0 ? "shadow-[0_0_50px_rgba(250,204,21,0.3)]" : i === 1 ? "shadow-[0_0_50px_rgba(34,211,238,0.2)]" : "shadow-[0_0_50px_rgba(255,0,189,0.2)]",
        }));

        const hallOfFame = sorted.slice(3, 15);
        return { topThree, hallOfFame };
    }, [pnodes]);

    if (isLoading && pnodes.length === 0) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 border-t-2 border-yellow-400 rounded-full animate-spin shadow-[0_0_30px_#facc15]" />
                <p className="text-yellow-400 font-[900] italic uppercase tracking-[0.5em] text-[10px] animate-pulse">Ranking_Championship_Data</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 md:gap-16 pb-40 max-w-7xl mx-auto overflow-visible">

            {/* --- 1. SOVEREIGN HEADER --- */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 pt-8 md:pt-12 border-b border-white/5 pb-10 md:pb-12 relative">
                <div className="scale-90 md:scale-100 origin-left">
                    <Headline title="HALL OF" title2="CHAMPIONS" subtitle="ELITE PERFORMANCE LEADERBOARD // SEASON 01" />
                </div>

                <div className="flex gap-6 md:gap-10 px-6 md:px-10 py-4 md:py-6 sovereign-glass rounded-[30px] md:rounded-[40px] border border-white/10 relative overflow-hidden group w-full xl:w-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Epoch_Reset</span>
                        <span className="text-lg md:text-2xl font-[900] italic text-white font-mono tracking-tighter tabular-nums">04D : 12H : 44M</span>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="p-2 md:p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 shadow-[0_0_20px_#facc15]">
                        <Trophy size={20} className="md:w-6 md:h-6" />
                    </div>
                </div>
            </header>

            {/* --- 2. THE DYNAMIC PODIUM HUB (Responsive Stack) --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-center gap-8 md:gap-10 pt-10 md:pt-12 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.03),transparent_70%)] pointer-events-none" />

                {/* Silver - Rank 2 (Order change on desktop) */}
                {topThree[1] && <ChampionPodium node={topThree[1]} height="md:h-[420px]" order="order-2 md:order-1" delay={0.2} />}

                {/* Gold - Rank 1 (Top priority) */}
                {topThree[0] && <ChampionPodium node={topThree[0]} height="md:h-[550px]" order="order-1 md:order-2" isWinner delay={0} />}

                {/* Bronze - Rank 3 */}
                {topThree[2] && <ChampionPodium node={topThree[2]} height="md:h-[380px]" order="order-3" delay={0.4} />}
            </div>

            {/* --- 3. HALL OF FAME REGISTRY (Responsive Table) --- */}
            <div className="sovereign-glass rounded-[40px] md:rounded-[60px] border-white/10 overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent opacity-50" />

                <div className="p-6 md:p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Fingerprint size={18} className="text-cyan-400" />
                        <h3 className="text-[9px] md:text-[11px] font-black text-white uppercase tracking-[0.5em]">Champions_Registry</h3>
                    </div>
                    <span className="hidden sm:block text-[9px] font-mono text-cyan-400 opacity-50 uppercase tracking-[0.2em] font-bold">Node_Efficiency_Index</span>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-black/20 text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                            <tr>
                                <th className="px-8 md:px-12 py-6 md:py-8">Rank</th>
                                <th className="px-8 md:px-12 py-6 md:py-8">Identity</th>
                                <th className="px-8 md:px-12 py-6 md:py-8 text-center">Performance</th>
                                <th className="px-8 md:px-12 py-6 md:py-8">Status</th>
                                <th className="px-8 md:px-12 py-6 md:py-8 text-right">Auth</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {hallOfFame.map((node, i) => (
                                <HallRow key={node.pubkey} node={node} rank={i + 4} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- 4. TACTICAL REWARD SUMMARY --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <LeaderboardInsight label="Aggregate Epoch Credits" value="8.42M" sub="PROVED" icon={Zap} color="cyan" />
                <LeaderboardInsight label="Sector Network ROI" value="14.2%" sub="STABLE" icon={TrendingUp} color="emerald" />
                <LeaderboardInsight label="Shard Consensus" value="42.8%" sub="ACTIVE" icon={Box} color="fuchsia" />
            </div>

        </div>
    );
}

// --- DIAMOND COMPONENTS ---

function ChampionPodium({ node, height, order, delay, isWinner }: any) {
    return (
        <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay, ease: "circOut" }}
            className={`w-full md:w-1/3 ${height} ${order} sovereign-glass rounded-[40px] md:rounded-[60px] p-6 md:p-10 relative flex flex-col justify-between items-center group overflow-hidden border-white/10 ${node.glow}`}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[22px] md:rounded-[30px] flex items-center justify-center border-2 shadow-2xl transition-all duration-700 group-hover:scale-110 ${isWinner ? 'bg-yellow-400 border-white/40 shadow-[0_0_40px_#facc15]' : 'bg-black/60 border-white/10'}`}>
                    {isWinner ? <Crown size={32} className="text-black" fill="black" /> : <Medal size={28} className={node.color} />}
                </div>
                <div className="text-center">
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${node.color}`}>Rank_0{node.rank}</span>
                    <h3 className="text-sm md:text-xl font-black italic text-white uppercase tracking-tighter mt-1">Node {node.pubkey?.slice(0, 6)}</h3>
                </div>
            </div>

            <div className="relative w-full py-6 md:py-8 border-y border-white/5 bg-white/[0.01] rounded-[24px] md:rounded-3xl flex flex-col items-center gap-1 my-4 md:my-0">
                <span className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">Score_Magnitude</span>
                <div className="flex items-center gap-2 md:gap-3">
                    <Star size={14} className={node.color} fill="currentColor" />
                    <span className="text-3xl md:text-5xl font-[900] italic text-white tracking-tighter tabular-nums">{node.score.toLocaleString()}</span>
                </div>
            </div>

            <div className="w-full space-y-3 md:space-y-4 relative z-10">
                <PodiumMetric label="UPTIME_SYNC" value={node.uptime} color={node.color} />
                <PodiumMetric label="STORAGE_ALLOC" value={node.shards} color={node.color} />
            </div>

            {isWinner && (
                <div className="mt-6 flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/5 border border-yellow-400/10">
                    <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-[8px] font-black text-yellow-400 uppercase tracking-widest">Legendary_Status</span>
                </div>
            )}
        </motion.div>
    );
}

function HallRow({ node, rank }: any) {
    return (
        <motion.tr
            initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
            className="group hover:bg-cyan-500/[0.03] transition-all duration-500 cursor-pointer"
        >
            <td className="px-8 md:px-12 py-6 md:py-10">
                <span className="font-mono text-cyan-400 font-[900] text-xs md:text-sm">#0{rank}</span>
            </td>
            <td className="px-8 md:px-12 py-6 md:py-10">
                <div className="flex flex-col gap-1">
                    <span className="text-xs md:text-[15px] font-black text-white group-hover:text-cyan-400 transition-colors uppercase italic tracking-tight leading-none">pNode_{node.pubkey?.slice(0, 8)}</span>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest truncate max-w-[120px] md:max-w-none">{node.pubkey}</span>
                </div>
            </td>
            <td className="px-8 md:px-12 py-6 md:py-10 text-center">
                <div className="inline-flex items-center gap-3">
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                    <span className="text-lg md:text-2xl font-[900] italic text-white tabular-nums tracking-tighter">{node.credits?.toLocaleString() || 0}</span>
                </div>
            </td>
            <td className="px-8 md:px-12 py-6 md:py-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/[0.03] w-fit">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{node.status}</span>
                </div>
            </td>
            <td className="px-8 md:px-12 py-6 md:py-10 text-right">
                <button className="p-3 md:p-4 rounded-xl md:rounded-2xl sovereign-glass border border-white/10 text-white/10 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-all">
                    <ArrowUpRight size={20} />
                </button>
            </td>
        </motion.tr>
    );
}

function PodiumMetric({ label, value, color }: any) {
    return (
        <div className="flex justify-between items-center px-1">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{label}</span>
            <span className={`text-[10px] md:text-xs font-[900] italic ${color} tracking-tighter`}>{value}</span>
        </div>
    );
}

function LeaderboardInsight({ label, value, sub, icon: Icon, color }: any) {
    const themes: any = {
        cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
        emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
        fuchsia: "text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/5"
    };

    return (
        <div className="sovereign-glass rounded-[40px] md:rounded-[50px] p-8 md:p-12 border-white/5 flex flex-col gap-4 group hover:border-white/20 hover:scale-[1.02] transition-all duration-500 overflow-hidden relative">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[22px] flex items-center justify-center border shadow-inner ${themes[color]}`}>
                <Icon size={24} className="md:size-32" />
            </div>
            <div className="space-y-1">
                <span className="text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{label}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-5xl font-[900] italic text-white tracking-tighter leading-none">{value}</span>
                    <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-widest italic ${themes[color].split(' ')[0]}`}>{sub}</span>
                </div>
            </div>
        </div>
    );
}