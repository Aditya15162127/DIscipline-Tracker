/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Shield, 
  Zap, 
  Cpu, 
  Target, 
  Terminal, 
  Lock, 
  Radio, 
  Cloud, 
  RefreshCw, 
  AlertTriangle, 
  ChevronRight, 
  KeyRound, 
  Server, 
  ShieldAlert,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginGatewayProps {
  onGoogleSignIn: () => Promise<void>;
  onGuestSignIn: () => Promise<void>;
  isSigningIn: boolean;
  authError: string | null;
  onClearError: () => void;
}

const OPERATOR_PREVIEWS = [
  {
    id: 'VADER',
    name: 'Darth Vader',
    tag: 'FATALISTIC PURGE',
    accent: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.3)',
    spec: '90m Max Screen Limit · Sith Silence',
    icon: Shield,
    directive: 'Purge digital leaks. No negotiations.',
  },
  {
    id: 'RONALDO',
    name: 'Cristiano Ronaldo',
    tag: 'RELENTLESS WILL',
    accent: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.08)',
    border: 'rgba(56, 189, 248, 0.3)',
    spec: '75m Workout Overdrive · 500 Reps',
    icon: Zap,
    directive: 'Obsessive repetition. Outwork everyone.',
  },
  {
    id: 'STARK',
    name: 'Tony Stark',
    tag: 'ARC OPTIMIZATION',
    accent: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.3)',
    spec: '210m Deep Study · 60p Schematics',
    icon: Cpu,
    directive: 'Cognitive bandwidth maximization.',
  },
  {
    id: 'BATMAN',
    name: 'Bruce Wayne',
    tag: 'SILENT DISCIPLINE',
    accent: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.08)',
    border: 'rgba(148, 163, 184, 0.3)',
    spec: 'Gotham Slate · 60m Nocturnal Lock',
    icon: Target,
    directive: 'Relentless execution in the dark.',
  },
];

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  onGoogleSignIn,
  onGuestSignIn,
  isSigningIn,
  authError,
  onClearError,
}) => {
  return (
    <div
      className="relative w-full min-h-screen bg-[#06080B] text-white flex flex-col justify-between overflow-y-auto select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* 1. Grain overlay matching the tactical brutalist aesthetic */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          opacity: 0.35,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* 2. Tactical Background Grid & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
          }}
        />
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] rounded-full blur-[140px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.09) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 80%)',
          }}
        />
      </div>

      {/* 3. Top Security Header Bar */}
      <header className="relative z-10 w-full border-b border-white/10 bg-[#040608]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 font-mono text-xs font-black shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-white uppercase">
                TACONIC DISCIPLINE OS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-red-500/15 border border-red-500/30 text-red-400 uppercase tracking-wider">
                ACCESS RESTRICTED
              </span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
              SECURITY LEVEL 5 // PROTOCOL GATEWAY
            </span>
          </div>
        </div>

        {/* Database Persistence Status Badge */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">FIRESTORE CLOUD STORE</span>
            <span className="text-white/30">|</span>
            <span className="text-slate-400 hidden md:inline">ai-studio-nexustacticalos</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] tracking-wider font-bold">ONLINE</span>
          </div>
        </div>
      </header>

      {/* 4. Main Authentication Body */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 my-auto flex flex-col items-center text-center">
        
        {/* Tactical Access Point Kicker */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
        >
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase">
            SECURE TERMINAL 01 // IDENTITY INITIALIZATION
          </span>
        </motion.div>

        {/* Brutalist Title & Kicker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3 mb-6"
        >
          <h1 
            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white"
            style={{
              textShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
              letterSpacing: '-0.02em',
            }}
          >
            TACONIC DISCIPLINE OS
          </h1>
          <div className="text-sm sm:text-base md:text-lg font-mono font-bold tracking-widest text-red-400 uppercase flex items-center justify-center gap-2">
            <span>[ AUTHENTICATION REQUIRED // SYSTEM LOCKED ]</span>
          </div>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed pt-2">
            Daily discipline telemetry, psychological operator models, and predictive alternate trajectories are encrypted. 
            Authenticate via Google OAuth to synchronize your profile and telemetry records to Google Cloud Firestore.
          </p>
        </motion.div>

        {/* Error Alert if any */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg mb-6 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center justify-between gap-3 text-left font-mono"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              onClick={onClearError}
              className="text-red-400 hover:text-white px-2 py-0.5 rounded bg-red-900/40 text-[10px] uppercase font-bold"
            >
              DISMISS
            </button>
          </motion.div>
        )}

        {/* 5. Authentication Actions Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#090C12]/90 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/80 space-y-4 relative overflow-hidden"
        >
          {/* Subtle top edge glow */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

          {/* Primary Action: Initialize with Google */}
          <button
            onClick={onGoogleSignIn}
            disabled={isSigningIn}
            className="w-full py-4 px-6 rounded-xl font-mono text-sm font-bold uppercase transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group shadow-xl bg-white hover:bg-slate-200 text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>INITIALIZING OAUTH...</span>
              </>
            ) : (
              <>
                {/* Google Icon SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div className="flex flex-col text-left">
                  <span>INITIALIZE WITH GOOGLE</span>
                  <span className="text-[10px] tracking-normal font-sans text-slate-600 font-semibold uppercase">
                    Full Cloud Firestore Sync
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 ml-auto text-black/60 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
              OR TEST RUN PROTOCOL
            </span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          {/* Secondary Action: Guest Protocol Bypass */}
          <button
            onClick={onGuestSignIn}
            disabled={isSigningIn}
            className="w-full py-3.5 px-5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white hover:border-white/30 active:scale-[0.99] disabled:opacity-50"
            title="Rapidly enter the terminal using an anonymous guest session"
          >
            <Terminal className="w-4 h-4 text-slate-400" />
            <span>BYPASS AUTHORIZATION // GUEST PROTOCOL</span>
          </button>

          <p className="text-[11px] text-slate-400 font-mono text-center pt-1">
            Guest mode creates an ephemeral local session. Choose Google for persistent cross-device tracking.
          </p>
        </motion.div>

        {/* 6. Operator Archetype Preview Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-4xl mt-10"
        >
          <div className="flex items-center justify-between mb-3 text-left">
            <div className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                OPERATOR ARCHETYPES READY ON INITIALIZATION
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">4 SPECIALIZED ENGINES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {OPERATOR_PREVIEWS.map((op) => {
              const IconComp = op.icon;
              return (
                <div
                  key={op.id}
                  className="p-3.5 rounded-xl border border-white/10 bg-[#0A0D12]/70 backdrop-blur-sm space-y-2 hover:border-white/25 transition-all"
                  style={{
                    backgroundColor: op.bg,
                    borderColor: op.border,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${op.accent}20`,
                        color: op.accent,
                        border: `1px solid ${op.accent}40`,
                      }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span 
                      className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${op.accent}25`,
                        color: op.accent,
                      }}
                    >
                      {op.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{op.name}</h4>
                    <p className="text-[10px] font-mono text-slate-300 mt-0.5">{op.spec}</p>
                  </div>

                  <p className="text-[11px] text-slate-400 italic line-clamp-1">
                    "{op.directive}"
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* 7. Bottom Security Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#040608]/90 backdrop-blur-md px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>DATA PERSISTENCE: users/{'{uid}'} & users/{'{uid}'}/daily_logs/{'{YYYY-MM-DD}'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">SECURE PROTOCOL // ZERO DATA LOSS</span>
          <span className="text-white/30">|</span>
          <span className="text-red-400 font-semibold">TACONIC OS v3.4.0</span>
        </div>
      </footer>
    </div>
  );
};
