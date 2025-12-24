"use client";
import { motion } from "framer-motion";
import { LayoutGrid, Server, Terminal, Globe, Shield, Crown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { icon: LayoutGrid, href: "/dashboard", label: "CORE" },
    { icon: Server, href: "/dashboard/nodes", label: "NODES" },
    { icon: Crown, href: "/dashboard/leaderboard", label: "Lead" },
    { icon: Terminal, href: "/dashboard/gossip", label: "GOSSIP" },
    { icon: Globe, href: "/dashboard/map", label: "RADAR" },
];

export default function CyberSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 h-[85vh] w-22 flex flex-col items-center justify-between py-12 rounded-[45px] relative overflow-hidden group">

            {/* 1. HIGH-QUALITY BACKGROUND LAYERS */}
            {/* Animated Gradient Base */}
            <div className="absolute inset-0 bg-[#050508] border border-white/10 z-0" />
            <motion.div
                animate={{
                    background: [
                        "radial-gradient(circle at 50% 0%, rgba(0, 242, 255, 0.15) 0%, transparent 70%)",
                        "radial-gradient(circle at 50% 100%, rgba(255, 0, 189, 0.15) 0%, transparent 70%)",
                        "radial-gradient(circle at 50% 0%, rgba(0, 242, 255, 0.15) 0%, transparent 70%)",
                    ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-0 z-0"
            />

            {/* Cyber Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />

            {/* Moving Laser Line Animation */}
            <motion.div
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent z-0 pointer-events-none"
            />

            {/* 2. BRAND SECTOR */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative group mb-2">
                    {/* Multi-layered Glow */}
                    <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-60 animate-pulse transition-opacity" />
                    <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-fuchsia-600 rounded-2xl opacity-40 blur-sm" />

                    <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center relative z-10 shadow-[0_0_30px_#00f2ff] border-t border-white/40 overflow-hidden">
                        {/* Glossy Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
                        <Shield size={28} className="text-black relative z-20" fill="black" />
                    </div>
                </div>
                <div className="h-px w-8 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-4" />
            </div>

            {/* 3. NAVIGATION SECTOR */}
            <nav className="flex flex-col gap-6 relative z-10">
                {NAV.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="relative group flex flex-col items-center">
                            <motion.div
                                className={`p-4 rounded-[22px] transition-all duration-500 relative z-10 
                  ${active
                                        ? 'text-cyan-400 bg-white/5 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,255,0.2)]'
                                        : 'text-white/20 hover:text-white/60 hover:bg-white/[0.02]'}`}
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <item.icon size={26} strokeWidth={active ? 2.5 : 1.5} className={active ? "drop-shadow-[0_0_8px_#00f2ff]" : ""} />

                                {/* Internal Glow for Active Item */}
                                {active && (
                                    <motion.div
                                        layoutId="inner-glow"
                                        className="absolute inset-0 bg-cyan-500/5 blur-md rounded-2xl"
                                    />
                                )}
                            </motion.div>

                            {/* Holographic Label (Only Active or Hover) */}
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                className="absolute -right-12 top-1/2 -translate-y-1/2 bg-black border border-cyan-500/50 text-cyan-400 text-[8px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none tracking-[0.2em] shadow-[0_0_15px_#00f2ff33] z-50"
                            >
                                {item.label}
                            </motion.span>

                            {/* Sidebar Trace Light */}
                            {active && (
                                <motion.div
                                    layoutId="sidebar-trace"
                                    className="absolute -left-6 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_#00f2ff] blur-[1px]"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* 4. POWER STATUS SECTOR */}
            {/*  */}

            {/* 5. OUTER RIM LIGHTING (Glass Effect)
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent shadow-[0_0_15px_rgba(0,242,255,0.3)]" /> */}

        </aside>
    );
}