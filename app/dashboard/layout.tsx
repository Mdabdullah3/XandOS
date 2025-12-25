/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Sidebar from "@/app/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, MessageSquare, BookOpen, CheckCircle2, ShieldCheck, Globe, ShieldHalf } from "lucide-react";
import { usePathname } from "next/navigation";
import { Activity } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden selection:bg-cyan-500/30">

      <div className="neural-flow fixed inset-0 z-0" />
      <div className="laser-mesh fixed inset-0 z-0" />
      <div className="cyber-noise fixed inset-0 z-50 pointer-events-none" />

      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative z-10 md:ml-20 transition-all duration-500 pb-20 md:pb-12">

        {/* --- STICKY HOLOGRAPHIC HUD --- */}
        <header className="sticky top-0 z-100 px-4 md:px-16 py-4 md:py-6">
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#010103] via-[#010103]/80 to-transparent pointer-events-none" />

          {/* ✅ FIXED: Removed 'group' from this div to prevent multi-icon hover sync */}
          <div className="relative sovereign-glass rounded-[25px] md:rounded-[40px] p-3 md:px-10 md:py-4 flex flex-row justify-between items-center gap-4 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">

            {/* Prism Border Trace */}
            <div className="absolute inset-0 p-px md:p-[1.5px] rounded-[inherit] bg-linear-to-r from-cyan-400 via-white/50 to-fuchsia-600 opacity-20 z-0" />

            {/* LEFT: IDENTITY MODULE */}
            <div className="relative z-10 flex items-center gap-3 md:gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <ShieldHalf size={14} className="text-cyan-400" />
                  <span className="text-[10px] md:text-[11px] font-black italic text-white uppercase tracking-[0.2em] md:tracking-[0.4em]">XandOS<span className="hidden xs:inline text-cyan-400">_Apex</span></span>
                </div>
                <div className="h-[1.5px] w-full bg-linear-to-r from-cyan-400 via-white to-transparent mt-1 opacity-50 shadow-[0_0_10px_#00f2ff]" />
              </div>
              <div className="w-px h-6 bg-white/10 hidden sm:block" />
              <div className="hidden lg:flex items-center gap-3">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">v1.0.4_Live</span>
              </div>
            </div>

            {/* RIGHT: ECOSYSTEM & TELEMETRY */}
            <div className="relative z-10 flex items-center gap-4 md:gap-10">
              <nav className="flex items-center gap-3 md:gap-8">
                {/* Individual links now handle their own hover groups */}
                <HeaderLink icon={BookOpen} label="Docs" href="https://xandeum.network" />
                <HeaderLink icon={MessageSquare} label="Discord" href="https://discord.gg/uqRSmmM5m" />
              </nav>

              <div className="hidden md:block w-px h-6 bg-white/10" />

              <div className="flex flex-col items-end shrink-0">
                <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em]">Neural_Sync</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span className="text-sm md:text-xl font-black italic text-white tracking-tighter tabular-nums leading-none">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* --- PAGE CONTENT --- */}
        <div className="max-w-[1700px] mx-auto px-4 md:px-10 pt-2 md:pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- FOOTER --- */}
        <footer className="mt-auto px-6 md:px-20 pt-10 opacity-40 hover:opacity-100 transition-all duration-700">
          <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent mb-10" />

          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-8 text-center lg:text-left">

            {/* Copyright & Info */}
            <div className="flex flex-col gap-3 items-center lg:items-start">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                <span>© 2025 XANDOS_ECOSYSTEM</span>
                <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                <span className="hidden sm:inline">L3_AUTHORIZED</span>
              </div>
              <div className="flex items-center gap-4">
                <FooterLink label="Network Stats" href="#" />
                <FooterLink label="Handshake Protocol" href="#" />
              </div>
            </div>

            {/* Signature Area */}
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10">
              <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                <ShieldCheck size={16} />
                <Globe size={16} />
                <Activity size={16} />
              </div>

              <div className="flex items-center gap-3 px-6 py-2.5 rounded-2xl sovereign-glass border border-white/10 shadow-2xl">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Built_by:</span>
                <span className="text-[11px] font-black italic text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-white to-fuchsia-500 uppercase tracking-tighter">
                  MdAbdullah
                </span>
              </div>
            </div>

          </div>
        </footer>

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS (Fixed Hover Logic) ---

function HeaderLink({ icon: Icon, label, href }: any) {
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      className="flex items-center gap-2 text-white/40 hover:text-white transition-all group/link"
    >
      {/* ✅ FIXED: Changed 'group-hover' to 'group-hover/link' to isolate this button */}
      <div className="p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/10 group-hover/link:border-cyan-500/50 group-hover/link:bg-cyan-500/10 transition-all">
        <Icon size={14} className="group-hover/link:rotate-12 transition-transform" />
      </div>
      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden md:block">
        {label}
      </span>
      <ExternalLink size={10} className="hidden lg:block opacity-0 group-hover/link:opacity-100 -translate-y-0.5 transition-all text-cyan-400" />
    </a>
  );
}

function FooterLink({ label, href }: any) {
  return (
    <a href={href} className="text-[9px] font-black text-white/20 hover:text-cyan-400 uppercase tracking-widest transition-all italic underline decoration-transparent hover:decoration-cyan-400 underline-offset-8">
      {label}
    </a>
  );
}