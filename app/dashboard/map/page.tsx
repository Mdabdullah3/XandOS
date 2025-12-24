/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Globe, Zap, Shield, Target, Crosshair, Loader2, Activity, MapPin, Radio, Share2 } from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';
import Headline from '@/app/components/Headline';

// --- GEOGRAPHIC COORDINATE MAPPING ---
const REGION_COORDS: any = {
    "Germany, EU": { coords: [10.4515, 51.1657], color: "#00f2ff" },
    "USA, North America": { coords: [-95.7129, 37.0902], color: "#ff00bd" },
    "London, UK": { coords: [-0.1276, 51.5074], color: "#b5ff00" },
    "Netherlands, EU": { coords: [5.2913, 52.1326], color: "#00f2ff" },
    "Spain, EU": { coords: [-3.7492, 40.4637], color: "#00f2ff" },
    "United Kingdom": { coords: [-3.436, 55.3781], color: "#b5ff00" },
    "USA, West Coast": { coords: [-122.4194, 37.7749], color: "#ff00bd" },
    "Global Node": { coords: [0, 20], color: "#94a3b8" }
};

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

export default function GlobalRadar() {
    const { pnodes, fetchPNodes, isLoading, stats } = useXandStore();
    const [hoveredRegion, setHoveredRegion] = useState<any>(null);

    useEffect(() => { fetchPNodes(); }, [fetchPNodes]);

    const regionalData = useMemo(() => {
        const aggregates = pnodes.reduce((acc: any, node: any) => {
            const r = node.region || "Global Node";
            if (!acc[r]) acc[r] = { count: 0, online: 0, storage: 0 };
            acc[r].count++;
            if (node.status === 'online') acc[r].online++;
            acc[r].storage += (node.storageCapacity || 0);
            return acc;
        }, {});

        return Object.keys(aggregates).map(name => ({
            name,
            ...aggregates[name],
            coordinates: REGION_COORDS[name]?.coords || [0, 0],
            color: REGION_COORDS[name]?.color || "#00f2ff",
            percentage: ((aggregates[name].count / (pnodes.length || 1)) * 100).toFixed(1)
        })).filter(r => r.name !== "Global Node" || r.count > 0);
    }, [pnodes]);

    return (
        <div className="flex flex-col gap-12 pb-40  max-w-7xl mx-auto overflow-visible">

            {/* --- 1. SOVEREIGN HEADER --- */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pt-12 border-b border-white/5 pb-12 relative">
                <Headline title="GLOBAL" title2="RADAR" subtitle="NEURAL GEOSPATIAL MONITOR // PNODES" />

                <div className="flex gap-10 px-10 py-6 sovereign-glass rounded-[40px] border border-white/10 relative overflow-hidden group backdrop-blur-3xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <HeaderMetric label="Sectors_Active" value={regionalData.length} icon={Target} color="text-cyan-400" />
                    <div className="w-px h-10 bg-white/10" />
                    <HeaderMetric label="Global_Uptime" value="99.9%" icon={Activity} color="text-emerald-400" />
                </div>
            </header>

            {/* --- 2. MAIN RADAR STAGE --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* THE HOLOGRAPHIC MAP CONSOLE */}
                <div className="lg:col-span-9 relative group">
                    {/* Diamond Brackets */}
                    <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-[32px] z-20 pointer-events-none" />
                    <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-cyan-500/40 rounded-br-[32px] z-20 pointer-events-none" />

                    <div className="sovereign-glass rounded-[60px] p-4 h-[500px] md:h-[750px] relative overflow-hidden flex items-center justify-center border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">

                        {/* Interactive Radar Scanning Atmosphere */}
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,242,255,0.3)_15deg,transparent_30deg)]"
                            />
                        </div>

                        {isLoading && pnodes.length === 0 ? (
                            <div className="flex flex-col items-center gap-6 relative z-30">
                                <Loader2 className="animate-spin text-cyan-400" size={56} />
                                <span className="text-[11px] font-black italic text-cyan-400 uppercase tracking-[0.8em] animate-pulse ml-4">Mapping_Neural_Nodes</span>
                            </div>
                        ) : (
                            <div className="relative z-10 w-full h-full p-4 md:p-12">
                                <ComposableMap projectionConfig={{ scale: 220 }} className="w-full h-full">
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) => geographies.map((geo) => (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill="rgba(255, 255, 255, 0.02)"
                                                stroke="rgba(255, 255, 255, 0.08)"
                                                strokeWidth={0.5}
                                                style={{
                                                    default: { outline: "none" },
                                                    hover: { fill: "rgba(0, 242, 255, 0.05)", transition: '0.3s' }
                                                }}
                                            />
                                        ))}
                                    </Geographies>

                                    {regionalData.map((reg: any) => (
                                        <Marker
                                            key={reg.name}
                                            coordinates={reg.coordinates}
                                            onMouseEnter={() => setHoveredRegion(reg)}
                                            onMouseLeave={() => setHoveredRegion(null)}
                                        >
                                            {/* Diamond Cluster Core */}
                                            <motion.circle
                                                r={8 + (reg.count / 12)}
                                                fill={reg.color}
                                                className="opacity-70 drop-shadow-[0_0_15px_rgba(0,242,255,1)]"
                                                animate={{ r: [8 + (reg.count / 12), 12 + (reg.count / 12), 8 + (reg.count / 12)] }}
                                                transition={{ duration: 2.5, repeat: Infinity }}
                                            />
                                            {/* Radial Ripple */}
                                            <circle r={25 + (reg.count / 6)} fill="transparent" stroke={reg.color} strokeWidth={0.8} className="animate-ping opacity-20" />
                                        </Marker>
                                    ))}
                                </ComposableMap>
                            </div>
                        )}

                        {/* DATA LENS OVERLAY (The Diamond Tooltip) */}
                        <AnimatePresence>
                            {hoveredRegion && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute top-12 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-12 w-80 bg-black/90 backdrop-blur-3xl border border-cyan-500/40 p-10 rounded-[50px] z-50 shadow-[0_40px_80px_rgba(0,0,0,1)]"
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-3">
                                            <Radio size={16} className="text-cyan-400 animate-pulse" />
                                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Sector_Lens</span>
                                        </div>
                                        <Share2 size={16} className="text-white/20 hover:text-white transition-colors cursor-pointer" />
                                    </div>

                                    <h2 className="text-3xl font-black italic text-white uppercase mb-8 tracking-tighter">{hoveredRegion.name}</h2>

                                    <div className="space-y-6">
                                        <LensStat label="DETECTION_COUNT" value={hoveredRegion.count} sub="pNodes Mapped" />
                                        <LensStat label="NETWORK_WEIGHT" value={`${hoveredRegion.percentage}%`} sub="Global Share" />
                                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black uppercase text-[11px] rounded-2xl tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            Initiate_Deep_Audit
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* SECTOR DENSITY SIDEBAR (Sovereign Style) */}
                <div className="lg:col-span-3 flex flex-col gap-10">
                    <div className="sovereign-glass rounded-[60px] p-10 flex-1 flex flex-col border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent shadow-2xl">
                        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-3">
                            <MapPin size={14} className="text-pink-500" /> Sector_Registry
                        </h3>

                        <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar pr-2">
                            {regionalData.sort((a, b) => b.count - a.count).map((reg) => (
                                <SectorModule key={reg.name} reg={reg} />
                            ))}
                        </div>

                        <div className="mt-12 p-6 rounded-[40px] bg-black/60 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-45 transition-transform duration-1000"><Shield size={80} /></div>
                            <div className="flex items-center gap-3 text-[10px] font-black text-cyan-400 uppercase mb-3 italic">
                                <Zap size={14} className="animate-bounce" /> Geospatial_Status
                            </div>
                            <p className="text-[11px] font-black italic text-white/40 leading-relaxed uppercase tracking-tighter">
                                Shards are geographically redundant. Integrity score: <span className="text-emerald-400">99.8% Master_OK</span>.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- DIAMOND RADAR SUB-COMPONENTS ---

function HeaderMetric({ label, value, icon: Icon, color }: any) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] flex items-center gap-2">
                <Icon size={12} className={color} /> {label}
            </span>
            <span className="text-3xl font-black italic tracking-tighter text-white tabular-nums leading-none uppercase">{value}</span>
        </div>
    );
}

function SectorModule({ reg }: any) {
    return (
        <div className="space-y-3 group cursor-pointer">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-[12px] font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight italic">{reg.name}</span>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{reg.online} ONLINE / {reg.count} TOTAL</span>
                </div>
                <span className="text-sm font-black italic text-white/60 tabular-nums">{reg.percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden p-[2px] border border-white/10 shadow-inner group-hover:border-cyan-500/30 transition-all">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${reg.percentage}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: reg.color, boxShadow: `0 0 15px ${reg.color}` }}
                />
            </div>
        </div>
    )
}

function LensStat({ label, value, sub }: any) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">{label}</span>
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter italic">{sub}</span>
            </div>
            <span className="text-3xl font-black italic text-white leading-none">{value}</span>
        </div>
    );
}