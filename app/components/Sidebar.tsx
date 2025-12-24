"use client";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Server, Terminal, Globe, Shield, Crown, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
    { icon: LayoutDashboard, href: "/dashboard", label: "Intelligence_Overview" },
    { icon: Server, href: "/dashboard/nodes", label: "Registry_Explorer" },
    { icon: Crown, href: "/dashboard/leaderboard", label: "Hall_of_Champions" },
    { icon: Terminal, href: "/dashboard/gossip", label: "Live_Gossip_Relay" },
    { icon: Globe, href: "/dashboard/map", label: "Global_Radar_Map" },
];

export default function CyberSidebar() {
    const pathname = usePathname();
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <aside className="fixed 
            /* Desktop Layout */
            md:left-16 md:top-1/2 md:-translate-y-1/2 md:h-[80vh] md:w-20 md:flex-col md:rounded-[40px]
            /* Mobile Layout */
            bottom-8 left-1/2 -translate-x-1/2 w-[90vw] h-20 flex-row rounded-[32px]
            /* Core Styling */
            z-[500] flex items-center justify-between p-2 md:py-12 sovereign-glass border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-all duration-700 overflow-hidden group"
        >
            {/* --- 1. DIAMOND REFRACTION BACKGROUND --- */}
            <div className="absolute inset-0 bg-[#010103]/80 z-0" />

            {/* Moving Iridescent Glow */}
            <motion.div
                animate={{
                    background: [
                        "radial-gradient(circle at 50% 0%, rgba(0, 242, 255, 0.15) 0%, transparent 70%)",
                        "radial-gradient(circle at 50% 100%, rgba(255, 0, 189, 0.15) 0%, transparent 70%)",
                        "radial-gradient(circle at 50% 0%, rgba(0, 242, 255, 0.15) 0%, transparent 70%)",
                    ]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0"
            />

            {/* Diamond Shine Sweep Animation */}
            <motion.div
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-12 z-0"
            />

            {/* --- 2. BRAND SECTOR (Desktop Only) --- */}
            <div className="hidden md:flex relative z-10 flex-col items-center mb-10">
                <div className="relative group">
                    <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity" />
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[#111] to-black border border-white/20 flex items-center justify-center relative z-10 shadow-2xl">
                        <Shield size={24} className="text-cyan-400 drop-shadow-[0_0_8px_#00f2ff]" fill="rgba(0, 242, 255, 0.1)" />
                    </div>
                </div>
                <div className="h-px w-6 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-10" />
            </div>

            {/* --- 3. NAVIGATION SECTOR --- */}
            <nav className="flex md:flex-col items-center justify-around w-full md:gap-10 relative z-10">
                {NAV.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onMouseEnter={() => setHovered(item.label)}
                            onMouseLeave={() => setHovered(null)}
                            className="relative group flex flex-col items-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-4 rounded-2xl transition-all duration-500 relative z-10 
                                    ${active
                                        ? 'text-white bg-white/10 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1)]'
                                        : 'text-white/20 hover:text-cyan-400 hover:bg-cyan-400/5'}`}
                            >
                                <item.icon size={22} strokeWidth={active ? 2.5 : 1.5} />

                                {active && (
                                    <motion.div
                                        layoutId="active-glow"
                                        className="absolute inset-0 bg-white/5 blur-md rounded-2xl"
                                    />
                                )}
                            </motion.div>

                            {/* --- DIAMOND TOOLTIP (Holographic HUD) --- */}
                            <AnimatePresence>
                                {hovered === item.label && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                        animate={{ opacity: 1, scale: 1, x: 45 }}
                                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                        className="absolute hidden md:flex items-center left-full top-1/2 -translate-y-1/2 z-[600] pointer-events-none"
                                    >
                                        <div className="w-4 h-[1px] bg-cyan-500/50" />
                                        <div className="bg-black/90 backdrop-blur-3xl border border-cyan-500/40 px-4 py-2 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                                            <span className="text-[10px] font-black italic text-cyan-400 uppercase tracking-[0.4em] whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Mobile Tooltip Style */}
                            <AnimatePresence>
                                {hovered === item.label && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: -50 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute md:hidden bottom-full left-1/2 -translate-x-1/2 z-[600] pointer-events-none"
                                    >
                                        <div className="bg-black/90 backdrop-blur-3xl border border-cyan-500/40 px-4 py-2 rounded-xl shadow-2xl">
                                            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em] whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* --- 4. TERMINAL SENSOR (Bottom Indicator) --- */}
            <div className="hidden md:flex relative z-10 flex-col items-center gap-4 mt-6">
                <div className="h-px w-6 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center relative">
                    <Search size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                    <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border border-cyan-400/20"
                    />
                </div>
            </div>

            {/* Refractive Edge Light */}
            <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-50" />
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent shadow-[0_0_15px_rgba(0,242,255,0.3)]" />

        </aside>
    );
}