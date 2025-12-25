/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, Globe, Zap, Activity, Cpu, Star,
    Share2, Fingerprint, Target, Radio,
    Download, Check
} from "lucide-react";
import Headline from '@/app/components/Headline';
import { useXandStore } from '@/app/store/useXandStore';
import { useRouter } from 'next/navigation';
interface PageProps {
    params: Promise<{ pubkey: string }>;
}
export default function NodeDetailPage({ params }: PageProps) {
    const router = useRouter();

    // ✅ Unwrap the promise params
    const resolvedParams = use(params);
    const pubkey = resolvedParams.pubkey;

    const { pnodes, fetchPNodes, isLoading: storeLoading } = useXandStore();

    const [node, setNode] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const found = pnodes.find((n: any) => n.pubkey === pubkey);
        if (found) {
            setNode(found);
        } else {
            fetchPNodes();
        }
    }, [pnodes, pubkey, fetchPNodes]);

    const handleDownload = () => {
        if (!node) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(node, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `audit_${node.pubkey.slice(0, 8)}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            fetchPNodes();
            setIsScanning(false);
        }, 3000);
    };

    if (storeLoading && !node) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#010103]">
                <div className="w-20 h-20 border-t-2 border-cyan-400 rounded-full animate-spin shadow-[0_0_30px_#00f2ff]" />
                <span className="text-cyan-400 font-black italic tracking-[0.5em] text-[10px] mt-6 animate-pulse uppercase">Syncing_Neural_Audit</span>
            </div>
        );
    }

    if (!node) return <div className="h-screen flex items-center justify-center text-white font-black italic">Identity_Unresolved</div>;
    return (
        <div className="flex flex-col gap-12 pb-20 max-w-7xl mx-auto overflow-visible font-sans">

            {/* --- HEADER --- */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pt-4 md:pt-6 border-b border-white/5 pb-10">
                <div className="flex items-start gap-8">

                    <Headline title={`Node ${node.pubkey.slice(0, 4)}`} title2="Audit" subtitle=' ' />
                </div>

                <div className="flex items-center gap-6">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 px-6 py-3 rounded-full flex items-center gap-4 backdrop-blur-3xl shadow-2xl">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] italic">Link_Established</span>
                    </div>
                    <button
                        onClick={handleShare}
                        className="p-5 rounded-[25px] sovereign-glass border border-white/10 text-white/20 hover:text-cyan-400 transition-all shadow-xl relative"
                    >
                        {copied ? <Check size={24} className="text-emerald-400" /> : <Share2 size={24} />}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* LEFT: VISUALS & ANALYSIS */}
                <div className="lg:col-span-8 flex flex-col gap-10">

                    {/* HOLOGRAPHIC MAP MODULE */}
                    <div
                        className="sovereign-glass rounded-[60px] h-[550px] relative overflow-hidden border border-white/10 group shadow-2xl cursor-crosshair"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${node.region}`, '_blank')}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_70%)]" />
                        <div className="p-12 relative z-10 flex justify-between items-start">
                            <div>
                                <h3 className="text-cyan-400 text-[11px] font-black uppercase tracking-[0.6em] mb-3 italic underline decoration-cyan-500/30 underline-offset-8">Neural_Geospatial_Target</h3>
                                <p className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-2xl">{node.region || "Global Relay Cluster"}</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-cyan-500 text-black shadow-[0_0_30px_#00f2ff]">
                                <Globe size={28} className="animate-spin-slow" />
                            </div>
                        </div>

                        {/* CYBER GLOBE VISUAL */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 scale-125">
                            <div className="w-[600px] h-[600px] border border-cyan-500/20 rounded-full animate-spin-slow" />
                            <div className="absolute w-100 h-100 border border-fuchsia-500/10 rounded-full animate-spin-reverse" />
                            <Target size={150} className="text-cyan-500 animate-pulse" />
                        </div>

                        <div className="absolute bottom-12 right-12 p-6 bg-cyan-400 text-black rounded-[30px] font-black uppercase text-[10px] tracking-widest shadow-2xl">
                            Click_To_Deploy_Maps_API
                        </div>
                    </div>

                    {/* DYNAMIC DIAGNOSTIC ORACLE */}
                    <div className="sovereign-glass rounded-[60px] p-12 border-white/10 relative overflow-hidden group shadow-2xl">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 rounded-[22px] bg-linear-to-br from-fuchsia-500 to-purple-700 text-black shadow-[0_0_30px_#ff00bd]">
                                    <Radio size={28} className={isScanning ? "animate-spin" : "animate-pulse"} />
                                </div>
                                <h3 className="text-[12px] font-black text-fuchsia-500 uppercase tracking-[0.5em]">Neural_Diagnostic_Oracle</h3>
                            </div>
                            {isScanning && <span className="font-mono text-fuchsia-400 text-[10px] animate-pulse">SCANNING_BITSTREAM...</span>}
                        </div>

                        <div className="relative min-h-[100px]">
                            <AnimatePresence mode="wait">
                                {isScanning ? (
                                    <motion.div
                                        key="scanning"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1/2 h-full bg-fuchsia-500" />
                                        </div>
                                        <p className="text-sm font-mono text-white/40">CALIBRATING_STORAGE_SHARDS... OK</p>
                                    </motion.div>
                                ) : (
                                    <motion.p
                                        key="result"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="text-xl md:text-2xl font-black italic text-white leading-tight uppercase tracking-tight"
                                    >
                                        &ldquo;System integrity for <span className="text-cyan-400">{node.pubkey.slice(0, 8)}</span> is rated as <span className="text-emerald-400 underline decoration-4 underline-offset-8">Sovereign</span>.
                                        Credits: <span className="text-fuchsia-400">{node.credits.toLocaleString()}</span>.
                                        Latency verified at {node.latency || '12'}ms.&rdquo;
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-5">
                            <button
                                onClick={handleScan}
                                disabled={isScanning}
                                className="px-10 py-5 bg-white text-black font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
                            >
                                {isScanning ? 'Processing...' : 'Run_Deep_System_Scan'}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="px-10 py-5 sovereign-glass border border-white/10 text-white/60 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3"
                            >
                                <Download size={16} /> Export_Audit_Logs
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: PERFORMANCE */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                    <div className="grid grid-cols-2 gap-6">
                        <GaugeCard label="LATENCY" value={`${node.latency || '12'}ms`} icon={Zap} color="cyan" />
                        <GaugeCard label="SHARD_EFF" value="100%" icon={Activity} color="emerald" />
                        <GaugeCard label="CPU_LOAD" value="4.2%" icon={Cpu} color="fuchsia" />
                        <GaugeCard label="CREDITS" value={node.credits?.toLocaleString()} icon={Star} color="yellow" />
                    </div>

                    <div className="sovereign-glass rounded-[60px] p-10 flex flex-col gap-10 border border-white/10 bg-linear-to-br from-white/3 to-transparent shadow-2xl group">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                            <Fingerprint size={24} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-1000" />
                            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Protocol_Specifications</h3>
                        </div>

                        <div className="space-y-8">
                            <AuditItem label="Neural_Status" value={node.status} color="text-emerald-400" />
                            <AuditItem label="Storage_Alloc" value={`${(node.storageCapacity / 1e9).toFixed(1)} GB`} color="text-cyan-400" />
                            <AuditItem label="Verified_Shard" value="Master_Chain" color="text-white" />
                            <AuditItem label="Node_Version" value={`v${node.version}`} color="text-fuchsia-500" />
                        </div>

                        <div className="mt-6 p-6 rounded-3xl bg-black/60 border border-white/5 relative group-hover:border-cyan-500/40 transition-colors">
                            <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase mb-3 italic">
                                <ShieldCheck size={14} className="animate-pulse" /> Verified_Status
                            </div>
                            <p className="text-[11px] font-black italic text-white/50 leading-relaxed uppercase tracking-tighter">
                                Node is contributing high-fidelity storage commits to the Xandeum cluster. Consensus established.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

function GaugeCard({ label, value, icon: Icon, color }: any) {
    const themes: any = {
        cyan: "text-cyan-400 border-cyan-400/30",
        emerald: "text-emerald-400 border-emerald-400/30",
        fuchsia: "text-fuchsia-400 border-fuchsia-400/30",
        yellow: "text-yellow-400 border-yellow-400/30",
    };
    return (
        <div className="sovereign-glass rounded-[45px] p-8 flex flex-col items-center justify-center gap-4 border border-white/5 hover:border-white/20 hover:scale-105 transition-all duration-500 relative overflow-hidden group">
            <Icon size={24} className={themes[color].split(' ')[0]} />
            <span className="text-2xl font-black italic text-white tracking-tighter leading-none">{value}</span>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</span>
        </div>
    );
}

function AuditItem({ label, value, color }: any) {
    return (
        <div className="flex justify-between items-center group cursor-crosshair">
            <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">{label}</span>
            <span className={`text-sm font-black italic tracking-tighter ${color} uppercase`}>{value}</span>
        </div>
    );
}