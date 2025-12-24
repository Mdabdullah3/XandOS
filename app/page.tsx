"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Zap, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#020408] flex items-center justify-center relative overflow-hidden px-6">

      {/* Background Decor */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />

      {/* LOGIN / ENTRY CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md glass-card rounded-[40px] p-10 relative z-10 flex flex-col items-center text-center shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        {/* Animated Brand Icon */}
        <div className="relative group mb-10">
          <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-[#080C14] to-[#12161C] border border-cyan-500/20 flex items-center justify-center relative z-10 shadow-inner">
            <Shield size={48} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(0,229,229,0.5)]" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
          Xand<span className="text-cyan-400">OS</span> Pulse
        </h1>
        <div className="flex items-center gap-2 mb-8">
          <div className="h-px w-8 bg-cyan-500/30" />
          <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-[0.3em]">
            Authorized_Access_Only
          </p>
          <div className="h-px w-8 bg-cyan-500/30" />
        </div>

        <p className="text-white/40 text-sm mb-10 leading-relaxed max-w-[280px]">
          Next-gen analytics and gossip monitoring for the Xandeum pNode cluster.
        </p>

        {/* ENTER ACTION */}
        <div className="w-full space-y-4">
          <Link href="/dashboard" className="block">
            <button className="w-full h-16 rounded-2xl bg-cyan-500 text-black font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all shadow-[0_20px_40px_-15px_rgba(6,182,212,0.5)] active:scale-95 group">
              Initialize Terminal
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-emerald-400" />
              <span className="text-[9px] font-mono text-white/30 uppercase">Mainnet_Live</span>
            </div>
            <div className="flex items-center gap-2">
              <TerminalIcon size={12} className="text-cyan-400" />
              <span className="text-[9px] font-mono text-white/30 uppercase">v1.0.4_BETA</span>
            </div>
          </div>
        </div>

        {/* Floating Background Glow for the Card */}
        <div className="absolute -bottom-2 -left-2 -right-2 h-20 bg-cyan-500/10 blur-3xl opacity-50 -z-10" />
      </motion.div>

      {/* BOTTOM FOOTER */}
      <footer className="absolute bottom-8 left-0 w-full flex justify-center opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[9px] font-mono text-white uppercase tracking-[0.4em]">
          Built for Xandeum • Powered by Solana
        </p>
      </footer>
    </div>
  );
}