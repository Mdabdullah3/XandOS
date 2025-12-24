"use client";
import Sidebar from "@/app/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen w-full flex overflow-hidden selection:bg-cyan-500/30">

      {/* 1. ANIMATED ENERGY BACKGROUND */}
      <div className="neural-flow" />
      <div className="laser-mesh" />
      <div className="cyber-noise" />

      {/* 2. NAVIGATION SIDEBAR */}
     <div className="w-24">
       <Sidebar />
     </div>

      {/* 3. MAIN CONTENT STAGE */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative z-10 px-8 py-10">
        <div className="max-w-[1500px] mx-auto">

          {/* TOP HUD DECOR */}
          <header className="flex justify-between items-center mb-5 px-6">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-cyan-400 tracking-[0.5em] uppercase">Sector_Alpha</span>
                <div className="h-[1px] w-full bg-gradient-to-r from-cyan-500 to-transparent mt-1" />
              </div>
              <div className="w-px h-8 bg-white/10 hidden md:block" />
              <div className="hidden md:block">
                <span className="text-[9px] text-white/30 uppercase font-mono tracking-widest">Protocol: Xandeum_v1.0</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right font-mono text-[10px]">
                <span className="block text-white/20 uppercase">Network_Sync</span>
                <span className="text-emerald-400 animate-pulse font-bold tracking-widest">OK_99.9%</span>
              </div>
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
        </div>
      </main>
    </div>
  );
}