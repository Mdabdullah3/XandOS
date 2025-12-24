"use client";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Server, Terminal, Globe, Shield, Crown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { icon: LayoutGrid, href: "/dashboard", label: "Overview" },
    { icon: Server, href: "/dashboard/nodes", label: "Registry" },
    { icon: Crown, href: "/dashboard/leaderboard", label: "Champs" },
    { icon: Terminal, href: "/dashboard/gossip", label: "Terminal" },
    { icon: Globe, href: "/dashboard/map", label: "Radar" },
];

export default function CyberSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed 
            /* Desktop Styles */
            md:left-16 md:top-1/2 md:-translate-y-1/2 md:h-[75vh] md:w-20 md:flex-col md:rounded-[30px]
            /* Mobile Styles */
            bottom-6 left-1/2 -translate-x-1/2 w-[92vw] h-16 flex-row rounded-[24px]
            /* Shared */
            z-[100] flex items-center justify-between py-4 md:py-8 px-4 md:px-0 sovereign-glass border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 overflow-hidden group"
        >
            {/* 1. HIGH-QUALITY BACKGROUND (Moving energy) */}
            <div className="absolute inset-0 bg-[#050508]/90 z-0" />
            <motion.div
                animate={{
                    background: [
                        "radial-gradient(circle at 50% 0%, rgba(0, 242, 255, 0.1) 0%, transparent 70%)",
                        "radial-gradient(circle at 50% 100%, rgba(255, 0, 189, 0.1) 0%, transparent 70%)",
                        "radial-gradient(circle at 50% 0%, rgba(0, 242, 255, 0.1) 0%, transparent 70%)",
                    ]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute inset-0 z-0"
            />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />

            {/* 2. BRAND SECTOR (Hidden on Mobile for Space) */}
            <div className="hidden md:flex relative z-10 flex-col items-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.4)] border-t border-white/30">
                    <Shield size={20} className="text-black" fill="black" />
                </div>
                <div className="h-px w-6 bg-white/10 mt-6" />
            </div>

            {/* 3. NAVIGATION SECTOR */}
            <nav className="flex md:flex-col items-center justify-around w-full md:gap-6 relative z-10">
                {NAV.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="relative group flex flex-col items-center">
                            <motion.div
                                className={`p-3 rounded-xl transition-all duration-300 relative z-10 
                                    ${active
                                        ? 'text-cyan-400 bg-white/5 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,242,255,0.15)]'
                                        : 'text-white/20 hover:text-white/60 hover:bg-white/[0.02]'}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <item.icon size={24} strokeWidth={active ? 2.5 : 2} />

                                {active && (
                                    <motion.div
                                        layoutId="inner-glow"
                                        className="absolute inset-0 bg-cyan-500/5 blur-md rounded-xl"
                                    />
                                )}
                            </motion.div>

                           
                            {/* Active Trace Light (Responsive Orientation) */}
                            {active && (
                                <motion.div
                                    layoutId="sidebar-trace"
                                    className="absolute 
                                        md:-left-6 md:top-0 md:bottom-0 md:w-1 
                                        -bottom-5 left-0 right-0 h-1 
                                        bg-cyan-500 shadow-[0_0_10px_#00f2ff]"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* 4. STATUS INDICATOR (Mini) */}
            <div className="hidden md:flex relative z-10 flex-col items-center gap-4">
                {/* <div className="w-1 h-8 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        animate={{ y: [0, 32, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-full h-3 bg-cyan-400 shadow-[0_0_8px_#00f2ff]"
                    />
                </div> */}
            </div>
        </aside>
    );
}