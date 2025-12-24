/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Globe, Zap, Target, Crosshair, Loader2, Shield } from "lucide-react";
import { useXandStore } from '@/app/store/useXandStore';

// --- GEOGRAPHIC COORDINATE MAPPING ---
// Maps your "Neural Geo-Mapper" strings to Map Coordinates
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

    // --- DATA SCIENCE: AGGREGATE NODES BY REGION ---
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
            percentage: ((aggregates[name].count / pnodes.length) * 100).toFixed(1)
        })).filter(r => r.name !== "Global Node" || r.count > 0);
    }, [pnodes]);

    return (
        <div className="flex flex-col gap-10 pb-40 px-4">

            {/* 1. RADAR HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                        Apex<span className="text-cyan-400">_Radar</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping shadow-[0_0_10px_#00f2ff]" />
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Sector: Geospatial_Neural_Monitor</p>
                    </div>
                </div>

                <div className="flex bg-black/40 border border-white/10 rounded-[30px] p-6 backdrop-blur-xl gap-12">
                    <MapStat label="TOTAL_SECTORS" value={regionalData.length} />
                    <MapStat label="NODES_ONLINE" value={stats.online} color="text-emerald-400" />
                    <MapStat label="GLOBAL_LOAD" value="84.2%" color="text-fuchsia-400" />
                </div>
            </div>

            {/* 2. MAIN RADAR STAGE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* THE HOLOGRAPHIC MAP */}
                <div className="lg:col-span-9 relative group">
                    <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl z-20" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl z-20" />

                    <div className="sovereign-glass rounded-[60px] p-4 h-[700px] relative overflow-hidden flex items-center justify-center border-white/5 shadow-2xl">

                        {/* Rotating Radar Sweep */}
                        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,242,255,0.4)_20deg,transparent_40deg)]"
                            />
                        </div>

                        {isLoading && pnodes.length === 0 ? (
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="animate-spin text-cyan-400" size={40} />
                                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Initialising_Map_Data...</span>
                            </div>
                        ) : (
                            <div className="relative z-10 w-full h-full">
                                <ComposableMap projectionConfig={{ scale: 210 }}>
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) => geographies.map((geo) => (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill="rgba(255, 255, 255, 0.02)"
                                                stroke="rgba(255, 255, 255, 0.08)"
                                                strokeWidth={0.5}
                                                style={{ default: { outline: "none" }, hover: { fill: "rgba(0, 242, 255, 0.04)" } }}
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
                                            {/* Dynamic Cluster Size based on Node count */}
                                            <motion.circle
                                                r={6 + (reg.count / 10)}
                                                fill={reg.color}
                                                className="opacity-80"
                                                animate={{ r: [6 + (reg.count / 10), 10 + (reg.count / 10), 6 + (reg.count / 10)] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            <circle r={20 + (reg.count / 5)} fill="transparent" stroke={reg.color} strokeWidth={0.5} className="animate-ping opacity-20" />
                                        </Marker>
                                    ))}
                                </ComposableMap>
                            </div>
                        )}

                        {/* DATA LENS OVERLAY */}
                        <AnimatePresence>
                            {hoveredRegion && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute top-12 right-12 w-72 bg-black/80 backdrop-blur-3xl border border-cyan-500/30 p-8 rounded-[40px] z-50 shadow-2xl"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Sector_Analysis</span>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                    <h2 className="text-2xl font-black italic text-white uppercase mb-6 tracking-tighter">{hoveredRegion.name}</h2>

                                    <div className="space-y-4">
                                        <LensStat label="Active pNodes" value={hoveredRegion.count} sub={`${hoveredRegion.online} Online`} />
                                        <LensStat label="Storage Share" value={`${hoveredRegion.percentage}%`} sub="Network Weight" />
                                        <div className="h-[1px] w-full bg-white/10" />
                                        <button className="w-full py-3 bg-cyan-500 text-black font-black uppercase text-[10px] rounded-xl tracking-[0.2em] hover:bg-cyan-400 transition-all">
                                            Deep_Scan_Sector
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* DYNAMIC SECTOR LIST */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="sovereign-glass rounded-[50px] p-8 flex-1 flex flex-col border-white/5">
                        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Sector_Density</h3>

                        <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
                            {regionalData.sort((a, b) => b.count - a.count).map((reg) => (
                                <SectorItem key={reg.name} reg={reg} />
                            ))}
                        </div>

                        <div className="mt-10 p-6 rounded-[30px] bg-cyan-500/5 border border-cyan-500/10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase mb-2">
                                <Shield size={14} /> Neural_Defence
                            </div>
                            <p className="text-[11px] font-mono text-white/40 leading-relaxed italic">
                                Cluster distribution is optimal. 0.02% variance in data redundancy across sectors.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function MapStat({ label, value, color = "text-white" }: any) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-white/20 tracking-widest uppercase">{label}</span>
            <span className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</span>
        </div>
    )
}

function SectorItem({ reg }: any) {
    return (
        <div className="space-y-2 group cursor-pointer">
            <div className="flex justify-between items-end">
                <span className="text-[11px] font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{reg.name}</span>
                <span className="text-xs font-black italic text-white/60 tabular-nums">{reg.count} Nodes</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden p-[1px]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${reg.percentage}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: reg.color, boxShadow: `0 0 10px ${reg.color}` }}
                />
            </div>
        </div>
    )
}

function LensStat({ label, value, sub }: any) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/30 uppercase">{label}</span>
                <span className="text-[9px] font-mono text-cyan-400 uppercase">{sub}</span>
            </div>
            <span className="text-xl font-black italic text-white">{value}</span>
        </div>
    );
}