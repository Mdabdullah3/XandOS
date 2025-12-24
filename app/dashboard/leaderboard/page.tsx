/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy, Crown, Medal, ArrowUpRight,
    ShieldCheck, Fingerprint, Loader2, Star,
    Zap, Clock, Target, Box, TrendingUp
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
            glow: i === 0 ? "shadow-[0_0_40px_rgba(250,204,21,0.3)]" : i === 1 ? "shadow-[0_0_40px_rgba(34,211,238,0.3)]" : "shadow-[0_0_40px_rgba(255,0,189,0.3)]",
        }));

        const hallOfFame = sorted.slice(3, 15);
        return { topThree, hallOfFame };
    }, [pnodes]);

    if (isLoading && pnodes.length === 0) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 border-t-2 border-yellow-400 rounded-full animate-spin shadow-[0_0_30px_#facc15]" />
                <p className="text-yellow-400 font-black italic uppercase tracking-[0.5em] text-sm animate-pulse">Ranking_Championship_Data</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-16 pb-40 max-w-7xl mx-auto overflow-visible">

            {/* --- 1. SOVEREIGN HEADER --- */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pt-12 border-b border-white/5 pb-12 relative">
                <Headline title="HALL OF" title2="CHAMPIONS" subtitle="ELITE PERFORMANCE LEADERBOARD // SEASON 01" />

                <div className="flex gap-10 px-10 py-6 sovereign-glass rounded-[40px] border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Epoch_Reset</span>
                        <span className="text-2xl font-black italic text-white font-mono tracking-tighter">04D : 12H : 44M</span>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 shadow-[0_0_20px_#facc15]">
                        <Trophy size={24} />
                    </div>
                </div>
            </header>

            {/* --- 2. THE DYNAMIC PODIUM HUB --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end pt-12 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.05),transparent_70%)]" />

                {/* Silver - Rank 2 */}
                {topThree[1] && <ChampionPodium node={topThree[1]} height="h-[420px]" order="order-2 md:order-1" delay={0.2} />}

                {/* Gold - Rank 1 */}
                {topThree[0] && <ChampionPodium node={topThree[0]} height="h-[550px]" order="order-1 md:order-2" isWinner delay={0} />}

                {/* Bronze - Rank 3 */}
                {topThree[2] && <ChampionPodium node={topThree[2]} height="h-[380px]" order="order-3" delay={0.4} />}
            </div>

            {/* --- 3. HALL OF FAME REGISTRY --- */}
            <div className="sovereign-glass rounded-[60px] border-white/10 overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent opacity-50" />

                <div className="p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Fingerprint size={20} className="text-cyan-400" />
                        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Legacy_Champions_Registry</h3>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 opacity-50 uppercase tracking-widest italic font-bold">Authenticated_Rank_Index</span>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-black/20 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                        <tr>
                            <th className="px-12 py-8">Global_Rank</th>
                            <th className="px-12 py-8">Node_Identity</th>
                            <th className="px-12 py-8">Performance_Credits</th>
                            <th className="px-12 py-8">Status</th>
                            <th className="px-12 py-8 text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {hallOfFame.map((node, i) => (
                            <HallRow key={node.pubkey} node={node} rank={i + 4} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- 4. TACTICAL REWARD SUMMARY (Diamond Extra Feature) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <LeaderboardInsight label="Total Epoch Work" value="8.42M" sub="CREDITS" icon={Zap} color="cyan" />
                <LeaderboardInsight label="Top Validator ROI" value="14.2%" sub="ANNUAL" icon={TrendingUp} color="emerald" />
                <LeaderboardInsight label="Active Shard Weight" value="42.8%" sub="CLUSTER" icon={Box} color="fuchsia" />
            </div>

        </div>
    );
}

// --- SUB-COMPONENTS (Diamond Tier) ---

function ChampionPodium({ node, height, order, delay, isWinner }: any) {
    return (
        <motion.div
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay, ease: "circOut" }}
            className={`${height} ${order} sovereign-glass rounded-[60px] p-10 relative flex flex-col justify-between items-center group overflow-hidden border-white/10 ${node.glow}`}
        >
            {/* Visual Identity Sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center border-2 shadow-2xl transition-all duration-700 group-hover:scale-110 ${isWinner ? 'bg-yellow-400 border-white/40 shadow-[0_0_50px_#facc15]' : 'bg-black/60 border-white/10'}`}>
                    {isWinner ? <Crown size={40} className="text-black" fill="black" /> : <Medal size={36} className={node.color} />}
                </div>
                <div className="text-center space-y-1">
                    <span className={`text-[11px] font-black uppercase tracking-[0.5em] ${node.color}`}>Rank_0{node.rank}</span>
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">{node.id}</h3>
                </div>
            </div>

            <div className="relative w-full py-8 border-y border-white/5 bg-white/[0.01] rounded-3xl flex flex-col items-center gap-1">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Aggregate_Credits</span>
                <div className="flex items-center gap-3">
                    <Star size={16} className={node.color} fill="currentColor" />
                    <span className="text-5xl font-black italic text-white tracking-tighter tabular-nums">{node.score.toLocaleString()}</span>
                </div>
            </div>

            <div className="w-full space-y-4 relative z-10">
                <PodiumMetric label="UPTIME_RATIO" value={node.uptime} color={node.color} />
                <PodiumMetric label="STORAGE_CAP" value={node.shards} color={node.color} />
            </div>

            {isWinner && (
                <div className="absolute bottom-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                    <span className="text-[8px] font-black text-yellow-400 uppercase tracking-[0.3em]">Legendary_Status</span>
                </div>
            )}
        </motion.div>
    );
}

function HallRow({ node, rank }: any) {
    return (
        <motion.tr
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="group hover:bg-white/[0.03] transition-all duration-500 cursor-pointer"
        >
            <td className="px-12 py-10">
                <span className="font-mono text-cyan-400 font-black text-sm">#0{rank}</span>
            </td>
            <td className="px-12 py-10">
                <div className="flex flex-col">
                    <span className="text-[15px] font-black italic text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-none mb-1">pNode_{node.pubkey?.slice(0, 8)}</span>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{node.pubkey}</span>
                </div>
            </td>
            <td className="px-12 py-10">
                <div className="flex items-center gap-3">
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                    <span className="text-2xl font-black italic text-white tabular-nums">{node.credits?.toLocaleString() || 0}</span>
                </div>
            </td>
            <td className="px-12 py-10">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{node.status}</span>
                </div>
            </td>
            <td className="px-12 py-10 text-right">
                <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/20 hover:text-cyan-400 transition-all shadow-xl hover:bg-cyan-500/5">
                    <ArrowUpRight size={24} />
                </button>
            </td>
        </motion.tr>
    );
}

function PodiumMetric({ label, value, color }: any) {
    return (
        <div className="flex justify-between items-center px-2">
            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
            <span className={`text-xs font-black italic ${color} tracking-tighter`}>{value}</span>
        </div>
    );
}

function LeaderboardInsight({ label, value, sub, icon: Icon, color }: any) {
    const colors: any = {
        cyan: "text-cyan-400 bg-cyan-400/5 border-cyan-400/20",
        emerald: "text-emerald-400 bg-emerald-400/5 border-emerald-400/20",
        fuchsia: "text-fuchsia-400 bg-fuchsia-400/5 border-fuchsia-400/20"
    };
    return (
        <div className="sovereign-glass rounded-[50px] p-12 border-white/5 flex flex-col gap-3 group hover:border-white/20 transition-all hover:scale-[1.03]">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div className="mt-4">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{label}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black italic text-white tracking-tighter">{value}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${colors[color].split(' ')[0]}`}>{sub}</span>
                </div>
            </div>
        </div>
    );
}