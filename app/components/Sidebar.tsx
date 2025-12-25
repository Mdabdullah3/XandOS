"use client";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Server, Terminal, Globe, Shield, Crown, Activity } from "lucide-react";
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
            /* Desktop: Dynamic Height to fit all 5 icons */
            md:left-20 md:top-1/2 md:-translate-y-1/2 md:h-[82vh] md:w-20 md:flex-col md:rounded-[40px]
            /* Mobile Layout */
            bottom-6 left-1/2 -translate-x-1/2 w-[94vw] h-20 flex-row rounded-[32px]
            /* Core Glass Styling */
            z-[500] flex items-center justify-between p-2 md:py-10 sovereign-glass shadow-[0_40px_100px_rgba(0,0,0,0.9)] transition-all duration-700"
        >
            {/* --- 1. PRISM BORDER (Cyan via White to Fuchsia) --- */}
            <div className="absolute inset-0 rounded-[inherit] p-[1.5px] bg-gradient-to-b from-cyan-400 via-white/80 to-fuchsia-600 opacity-40 z-0 pointer-events-none" />

            {/* --- 2. INTERNAL REFRACTION BACKGROUND --- */}
            <div className="absolute inset-[1px] bg-[#010103]/95 rounded-[inherit] overflow-hidden z-0">
                <motion.div
                    animate={{
                        background: [
                            "radial-gradient(circle at 50% 0%, rgba(0, 242, 255, 0.15) 0%, transparent 70%)",
                            "radial-gradient(circle at 50% 100%, rgba(192, 38, 211, 0.15) 0%, transparent 70%)",
                            "radial-gradient(circle at 50% 0%, rgba(0, 242, 255, 0.15) 0%, transparent 70%)",
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0"
                />
                {/* Prism Light Sweep */}
                <motion.div
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />
            </div>

            {/* --- 3. BRAND SECTOR (Desktop Only) --- */}
            <div className="hidden md:flex relative z-10 flex-col items-center mb-4">
                <div className="relative group">
                    <div className="absolute inset-0 bg-white blur-2xl opacity-10 group-hover:opacity-30 animate-pulse transition-opacity" />
                    <div className="w-12 h-12 rounded-[20px] bg-black border border-white/20 flex items-center justify-center relative z-10 shadow-2xl">
                        <Shield size={22} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </div>
                </div>
                <div className="h-px w-6 bg-gradient-to-r from-cyan-400 via-white to-fuchsia-600 mt-10 opacity-40" />
            </div>

            {/* --- 4. NAVIGATION SECTOR --- */}
            <nav className="flex md:flex-col items-center justify-around w-full md:gap-6 relative z-10">
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
                            {/* Module Container */}
                            <motion.div
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-4 rounded-2xl transition-all duration-500 relative z-10 
                                    ${active
                                        ? 'text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                        : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                            >
                                <item.icon size={22} strokeWidth={active ? 2.5 : 1.5} />

                                {active && (
                                    <motion.div
                                        layoutId="active-bg-glow"
                                        className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-white/10 to-fuchsia-600/20 blur-md rounded-2xl"
                                    />
                                )}
                            </motion.div>

                            {/* --- PRISM ACTIVE BAR --- */}
                            {active && (
                                <motion.div
                                    layoutId="sidebar-trace"
                                    className="absolute 
                                        md:-left-10 md:top-0 md:bottom-0 md:w-1.5 
                                        -bottom-6 left-0 right-0 h-1.5 
                                        bg-gradient-to-b from-cyan-400 via-white to-fuchsia-600 
                                        md:bg-gradient-to-b shadow-[0_0_15px_rgba(0,242,255,0.5)] rounded-full"
                                />
                            )}

                            {/* --- HOLOGRAPHIC TOOLTIP --- */}
                            <AnimatePresence>
                                {hovered === item.label && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                                        animate={{ opacity: 1, scale: 1, x: 45 }}
                                        exit={{ opacity: 0, scale: 0.8, x: 10 }}
                                        className="absolute hidden md:flex items-center left-full top-1/2 -translate-y-1/2 z-[600] pointer-events-none"
                                    >
                                        <div className="w-4 h-[1.5px] bg-white/40" />
                                        <div className="bg-black/95 backdrop-blur-3xl border border-white/10 px-4 py-2 rounded-xl shadow-2xl border-l-[3px] border-l-cyan-400">
                                            <span className="text-[10px] font-[900] italic text-white uppercase tracking-[0.4em] whitespace-nowrap">
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

            {/* --- 5. TACTICAL SENSOR (Bottom) --- */}
            <div className="hidden md:flex relative z-10 flex-col items-center gap-4">
                <div className="h-px w-6 bg-gradient-to-r from-cyan-400 via-white to-fuchsia-600 opacity-40" />
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center relative group-hover:border-white/30 transition-all">
                    <Activity size={16} className="text-cyan-400 animate-pulse" />
                </div>
            </div>

        </aside>
    );
}