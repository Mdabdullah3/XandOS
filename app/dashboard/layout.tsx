/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Sidebar from "@/app/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ExternalLink, MessageSquare, ShieldCheck } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen w-full flex overflow-hidden selection:bg-cyan-500/30">

      {/* 1. ANIMATED ENERGY BACKGROUND */}
      <div className="neural-flow" />
      <div className="laser-mesh" />
      <div className="cyber-noise" />

      {/* 2. NAVIGATION SIDEBAR */}
      <div className="md:w-24 w-0">
        <Sidebar />
      </div>

      {/* 3. MAIN CONTENT STAGE */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative z-10 px-8 py-6">
        <div className="max-w-[1500px] mx-auto">

          <header className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-black/20 backdrop-blur-xl border border-white/5 p-4 md:px-8 md:py-4 rounded-[30px] shadow-2xl">

            {/* Left: Identity & Sector */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-cyan-400 tracking-[0.4em] uppercase">Xand Os</span>
                <div className="h-px w-full bg-linear-to-r from-cyan-400 via-white to-transparent" />
              </div>
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-3 text-white/40">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest italic">Protocol_v1.0.4_Stable</span>
              </div>
            </div>

            {/* Right: Professional Ecosystem Links */}
            <div className="flex items-center gap-6 md:gap-10">
              <nav className="flex items-center gap-6">
                <HeaderLink icon={BookOpen} label="Docs" href="https://xandeum.network" />
                <HeaderLink icon={MessageSquare} label="Discord" href="https://discord.gg/uqRSmmM5m" />
                <div className="w-px h-4 bg-white/10" />
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Network_Sync</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-emerald-400 font-black italic text-xs tracking-tighter tabular-nums">99.9%</span>
                  </div>
                </div>
              </nav>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6, ease: "circOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>

          <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-700">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              <span>© 2025 XandOS Apex</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span>Powered by Xandeum</span>
            </div>

            <div className="flex items-center gap-8">
              <FooterLink label="Mainnet Explorer" href="#" />
              <FooterLink label="Validator Metrics" href="#" />
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Built by</span>
                <span className="text-[10px] font-black text-cyan-400 italic">MdAbdullah</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
function HeaderLink({ icon: Icon, label, href }: any) {
  return (
    <a 
      href={href} target="_blank" rel="noreferrer"
      className="flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-all group"
    >
      <Icon size={14} className="group-hover:rotate-12 transition-transform" />
      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{label}</span>
      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 -translate-y-1 transition-all" />
    </a>
  );
}
function FooterLink({ label, href }: any) {
  return (
    <a href={href} className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors">
      {label}
    </a>
  );
}