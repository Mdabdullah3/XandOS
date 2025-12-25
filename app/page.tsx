/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Fingerprint } from 'lucide-react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // OUTER FRAME: Solid Black
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-4 md:p-8 selection:bg-cyan-500/30 overflow-hidden font-sans">

      {/* --- 1. THE IMAGE-INSPIRED BACKGROUND SHELL --- */}
      <div className="absolute inset-0 overflow-hidden z-0 border border-white/5 shadow-2xl">
        {/* The Gradient from your reference image */}
        <div className="absolute inset-0 bg-linear-to-br from-[#1a1a2e] via-[#010103] to-[#0d0d1a]" />

        {/* Keep the Neural Flow & Mesh inside the shell */}
        <div className="neural-flow opacity-40" />
        <div className="laser-mesh opacity-10" />

        {/* Ambient Glows from the image */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-fuchsia-600/10 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] pointer-events-none animate-pulse" />
      </div>

      {/* --- 2. TACTICAL CONSOLE (Content) --- */}
      <div className="relative z-10 w-full max-w-6xl px-8 flex flex-col items-center">



        {/* --- HERO TITLE --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="text-center space-y-4 mb-14"
        >
          <h1 className="text-6xl md:text-[110px] lg:text-[130px] font-[900] italic tracking-[-0.07em] text-white uppercase leading-[0.85] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            Launch <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-600 drop-shadow-[0_0_30px_rgba(0,242,255,0.3)]">The Pulse</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-white/10" />
            <p className="text-white/40 font-black text-[10px] md:text-xs tracking-[0.6em] uppercase italic">
              Sovereign Intelligence Architecture
            </p>
            <div className="h-[1px] w-12 bg-white/10" />
          </div>
        </motion.div>

        {/* --- DIAMOND BUTTON --- */}
        <Link href="/dashboard" className="relative group mb-16 md:mb-20 outline-none">
          {/* Rotating Prism Border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 bg-linear-to-r from-cyan-500 via-white to-fuchsia-500 rounded-full opacity-20 blur-sm group-hover:opacity-100 transition-opacity"
          />

          <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative px-6 md:px-12 py-4 md:py-7 bg-[#050508] border border-white/20 rounded-full flex items-center justify-center gap-6 md:gap-8 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden"
          >
            {/* Internal Refraction Light */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-fuchsia-500/5" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Fingerprint size={20} className="text-cyan-400" />
              </div>
              <span className="text-[11px] md:text-[12px] font-[900] text-white uppercase tracking-[0.4em] ml-2">Initialize_Dashboard</span>
            </div>

            <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-black group-hover:bg-cyan-400 transition-all duration-500">
              <ChevronRight size={22} strokeWidth={3} />
            </div>
          </motion.button>
        </Link>

        {/* --- TELEMETRY FOOTER --- */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-12 pt-16 border-t border-white/5 relative">
          {/* Background Laser Divider Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-cyan-500 shadow-[0_0_10px_#00f2ff]" />

          <TelemetryItem
            label="Protocol"
            value="V1.0.4"
            color="text-cyan-400"
          />
          <TelemetryItem
            label="Network"
            value="Syncing"
            color="text-cyan-400"
          />
          <TelemetryItem label="Auth" value="Pass" color="text-cyan-400" />
          <TelemetryItem label="Cluster" value="Live" color="text-cyan-400" />
        </div>
      </div>

      {/* --- EXTRA DECOR --- */}
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-600/10 blur-[150px] pointer-events-none" />
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] pointer-events-none" />

      <style jsx global>{`
        .text-glow {
          filter: drop-shadow(0 0 20px rgba(0, 242, 255, 0.4));
        }
      `}</style>
    </div>
  );
}

function TelemetryItem({ label, value, color }: any) {
  return (
    <div className="flex flex-col gap-2 items-center md:items-start group cursor-crosshair">
      <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] group-hover:text-white transition-colors">
        {label}
      </span>
      <span
        className={`text-2xl font-[900] italic tracking-tighter uppercase ${color} drop-shadow-[0_0_8px_rgba(0,242,255,0.2)]`}
      >
        {value}
      </span>
    </div>
  );
}
