/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Dumbbell, 
  BookOpen, 
  Smartphone, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  Radio, 
  Plus, 
  Shield, 
  Zap, 
  Cpu, 
  Target,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonaId } from '../App.tsx';
import { CustomTaskPillar, PRELOADED_ACTIVITIES } from '../types/pillar5.ts';

interface PersonaConfig {
  id: PersonaId;
  name: string;
  alias: string;
  accentColor: string;
  glowColor: string;
  badgeClass: string;
  headerBorder: string;
  feedbackQuote: string;
  tacticalDirective: string;
  tag: string;
  frictionMultiplier: number;
  weightFocus: string;
  quoteAttribution: string;
  signatureRequirement: string;
  psychologicalApproach: string;
  quotas: {
    workout: number;
    study: number;
    reading: number;
    maxScreen: number;
  };
  labels: {
    workout: string;
    study: string;
    reading: string;
    screentime: string;
  };
}

interface TrajectoryGraphProjectionProps {
  workoutMinutes: number;
  studyMinutes: number;
  readingPages: number;
  screenMinutes: number;
  macroProgress: number;
  executionScore: number;
  activePersona: PersonaConfig;
  targetWorkout: number;
  targetStudy: number;
  targetReading: number;
  maxScreenTime: number;
  actionLogsCount: number;
  customTask?: CustomTaskPillar | null;
  onQuickLog: (category: 'workout' | 'study' | 'reading' | 'screentime' | 'custom', amount: number) => void;
}

type PillarFilter = 'all' | 'workout' | 'study' | 'reading' | 'screentime' | 'custom';

export const TrajectoryGraphProjection: React.FC<TrajectoryGraphProjectionProps> = ({
  workoutMinutes,
  studyMinutes,
  readingPages,
  screenMinutes,
  macroProgress,
  executionScore,
  activePersona,
  targetWorkout,
  targetStudy,
  targetReading,
  maxScreenTime,
  actionLogsCount,
  customTask,
  onQuickLog,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarFilter>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    userVal: number;
    targetVal: number;
    projectedVal: number;
    x: number;
    y: number;
  } | null>(null);

  // Check if user has entered any activity logs / inputs
  const hasInputs = useMemo(() => {
    return workoutMinutes > 0 || studyMinutes > 0 || readingPages > 0 || screenMinutes > 0 || actionLogsCount > 0 || (customTask?.isConfigured && customTask.current > 0);
  }, [workoutMinutes, studyMinutes, readingPages, screenMinutes, actionLogsCount, customTask]);

  // Pillar Evaluations & Archetype Ideological Diagnostics
  const evaluations = useMemo(() => {
    const workoutPct = Math.round((workoutMinutes / (targetWorkout || 60)) * 100);
    const studyPct = Math.round((studyMinutes / (targetStudy || 180)) * 100);
    const readingPct = Math.round((readingPages / (targetReading || 30)) * 100);
    const screenExcess = Math.max(0, screenMinutes - maxScreenTime);

    // Dynamic archetype commentary per habit
    let workoutRemark = '';
    let workoutStatus: 'approved' | 'correction' = workoutPct >= 100 ? 'approved' : 'correction';

    let studyRemark = '';
    let studyStatus: 'approved' | 'correction' = studyPct >= 100 ? 'approved' : 'correction';

    let readingRemark = '';
    let readingStatus: 'approved' | 'correction' = readingPct >= 100 ? 'approved' : 'correction';

    let screenRemark = '';
    let screenStatus: 'approved' | 'correction' = screenExcess === 0 ? 'approved' : 'correction';

    switch (activePersona.id) {
      case 'VADER':
        workoutRemark = workoutPct >= 100
          ? "Combat conditioning verified. Your physical armor is prepared for the Imperial fleet."
          : `Physical weakness detected (${workoutMinutes}/${targetWorkout}m). You cannot command destiny with frail stamina. Add ${Math.max(15, targetWorkout - workoutMinutes)}m immediately.`;
        studyRemark = studyPct >= 100
          ? "Sith holocrons reviewed with precision. Dark knowledge fuels your focus."
          : `Intellect drifting (${studyMinutes}/${targetStudy}m). A distracted mind is easily manipulated. Accelerate study by ${Math.max(30, targetStudy - studyMinutes)}m.`;
        readingRemark = readingPct >= 100
          ? "Dark archives digested. Tactical meditation maintained."
          : `Archive reading quota unmet (${readingPages}/${targetReading}p). Silence excuses and execute ${Math.max(10, targetReading - readingPages)} pages.`;
        screenRemark = screenExcess === 0
          ? "Screen leakage contained within Imperial parameters (<=90m). Objective discipline maintained."
          : `FATALISTIC PURGE REQUIRED! You leaked +${screenExcess}m of precious attention to meaningless digital noise. Cut this insubordination instantly.`;
        break;

      case 'RONALDO':
        workoutRemark = workoutPct >= 100
          ? "SIUUU! Elite volume standards met. Unmatched physical repetition is our baseline."
          : `Only ${workoutMinutes}m logged? While you rest, rivals are hammering 500 reps. Add ${Math.max(20, targetWorkout - workoutMinutes)}m to match the machine standard.`;
        studyRemark = studyPct >= 100
          ? "Tactical review on point. Football intelligence requires relentless mental study."
          : `Tactical match analysis is short (${studyMinutes}/${targetStudy}m). Elevate your study discipline by ${Math.max(30, targetStudy - studyMinutes)}m.`;
        readingRemark = readingPct >= 100
          ? "Champion mindset reading completed. Mental toughness is forged daily."
          : `Mindset reading lagging (${readingPages}/${targetReading}p). Complete ${Math.max(10, targetReading - readingPages)} pages before you call it a day.`;
        screenRemark = screenExcess === 0
          ? "Distractions minimized. Machine focus locked on recovery and performance."
          : `Media leakage (+${screenExcess}m) is draining your edge. Put the phone down and redirect energy into physical recovery.`;
        break;

      case 'STARK':
        workoutRemark = workoutPct >= 100
          ? "Biomechanical endurance optimized. Ready for sustained suit maneuvers."
          : `Suit calibration warning: Endurance at ${workoutPct}%. Add ${Math.max(15, targetWorkout - workoutMinutes)}m of fabrication conditioning.`;
        studyRemark = studyPct >= 100
          ? "1.21 Gigawatts of cognitive bandwidth achieved! Quantum physics modules integrated."
          : `Cognitive bottleneck detected (${studyMinutes}/${targetStudy}m). Channel ${Math.max(30, targetStudy - studyMinutes)}m into deep learning modules.`;
        readingRemark = readingPct >= 100
          ? "Blueprint schematics fully absorbed. R&D phase accelerated."
          : `Schematic review is lagging (${readingPages}/${targetReading}p). Ingest ${Math.max(15, targetReading - readingPages)} technical pages now.`;
        screenRemark = screenExcess === 0
          ? "Terminal usage strictly channeled into productive StarkNet engineering."
          : `Reactor overheating! +${screenExcess}m lost to non-productive algorithmic loops. Reallocate digital time to R&D.`;
        break;

      case 'BATMAN':
        workoutRemark = workoutPct >= 100
          ? "Combat conditioning meets League standards. The shadows do not yield to weakness."
          : `Physical conditioning soft (${workoutMinutes}/${targetWorkout}m). Push through muscle failure for ${Math.max(15, targetWorkout - workoutMinutes)} more minutes.`;
        studyRemark = studyPct >= 100
          ? "Forensic crime analysis logged. Gotham is observed with surgical precision."
          : `Forensic analysis incomplete (${studyMinutes}/${targetStudy}m). You cannot outthink the city without ${Math.max(30, targetStudy - studyMinutes)}m more study.`;
        readingRemark = readingPct >= 100
          ? "Case files and tactical intelligence memorized."
          : `Case files neglected (${readingPages}/${targetReading}p). Review ${Math.max(10, targetReading - readingPages)} pages before nocturnal patrol.`;
        screenRemark = screenExcess === 0
          ? "Nocturnal blackout enforced. Zero surveillance signatures leaked."
          : `SECURITY COMPROMISED! +${screenExcess}m of nocturnal screen leakage detected. Blackout devices to restore stealth focus.`;
        break;
    }

    return {
      workout: {
        pct: workoutPct,
        current: workoutMinutes,
        target: targetWorkout,
        unit: 'min',
        status: workoutStatus,
        remark: workoutRemark,
        label: activePersona.labels.workout,
      },
      study: {
        pct: studyPct,
        current: studyMinutes,
        target: targetStudy,
        unit: 'min',
        status: studyStatus,
        remark: studyRemark,
        label: activePersona.labels.study,
      },
      reading: {
        pct: readingPct,
        current: readingPages,
        target: targetReading,
        unit: 'pages',
        status: readingStatus,
        remark: readingRemark,
        label: activePersona.labels.reading,
      },
      screentime: {
        pct: Math.round((screenMinutes / (maxScreenTime || 90)) * 100),
        current: screenMinutes,
        target: maxScreenTime,
        unit: 'min limit',
        status: screenStatus,
        remark: screenRemark,
        excess: screenExcess,
        label: activePersona.labels.screentime,
      },
    };
  }, [
    workoutMinutes, targetWorkout,
    studyMinutes, targetStudy,
    readingPages, targetReading,
    screenMinutes, maxScreenTime,
    activePersona
  ]);

  // Time milestones for the Graph X-axis (24-hour cycle checkpoints)
  const timeCheckpoints = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'];

  // Calculate current baseline progress ratio (0 to 1) for the curve
  const currentRatio = useMemo(() => {
    if (!hasInputs) return 0;
    const wRatio = Math.min(1.2, workoutMinutes / (targetWorkout || 60));
    const sRatio = Math.min(1.2, studyMinutes / (targetStudy || 180));
    const rRatio = Math.min(1.2, readingPages / (targetReading || 30));
    const screenExcessRatio = Math.max(0, (screenMinutes - maxScreenTime) / 60);
    const composite = (wRatio * 0.3) + (sRatio * 0.35) + (rRatio * 0.2) + ((macroProgress / 100) * 0.15) - (screenExcessRatio * 0.1);
    return Math.max(0.05, Math.min(1.3, composite));
  }, [hasInputs, workoutMinutes, targetWorkout, studyMinutes, targetStudy, readingPages, targetReading, screenMinutes, maxScreenTime, macroProgress]);

  // Generate SVG points based on user inputs vs archetype ideology
  const graphPoints = useMemo(() => {
    if (!hasInputs) return [];

    // Depending on selected pillar:
    let userMax = 100;
    let targetMax = 100;

    if (selectedPillar === 'workout') {
      userMax = workoutMinutes;
      targetMax = targetWorkout;
    } else if (selectedPillar === 'study') {
      userMax = studyMinutes;
      targetMax = targetStudy;
    } else if (selectedPillar === 'reading') {
      userMax = readingPages;
      targetMax = targetReading;
    } else if (selectedPillar === 'screentime') {
      userMax = screenMinutes;
      targetMax = maxScreenTime;
    } else if (selectedPillar === 'custom' && customTask?.isConfigured) {
      userMax = customTask.current;
      targetMax = customTask.target;
    } else {
      userMax = executionScore;
      targetMax = 100;
    }

    const ratio = targetMax > 0 ? userMax / targetMax : 0;

    // 7 points along the day
    return timeCheckpoints.map((time, idx) => {
      const stepFactor = (idx + 1) / timeCheckpoints.length;
      
      // Target progression curve (Ideal archetype benchmark)
      const targetVal = Math.round(targetMax * stepFactor);
      
      // User Actual Logged progression curve (up to current ratio)
      const userVal = Math.round(userMax * Math.min(1, (idx / 3.5)));
      
      // Projected Trajectory if user enforces archetype corrective suggestions
      const projectedVal = Math.round(targetMax * Math.min(1.2, (idx / 3.5) * (ratio > 0.8 ? 1.15 : 0.95)));

      return {
        time,
        userVal: Math.max(0, userVal),
        targetVal,
        projectedVal,
        stepFactor,
      };
    });
  }, [hasInputs, selectedPillar, workoutMinutes, targetWorkout, studyMinutes, targetStudy, readingPages, targetReading, screenMinutes, maxScreenTime, executionScore, customTask]);

  // SVG Geometry Dimensions
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingX = 50;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Max scale for Y
  const maxY = useMemo(() => {
    if (!hasInputs) return 100;
    if (selectedPillar === 'workout') return Math.max(targetWorkout * 1.25, workoutMinutes * 1.2, 80);
    if (selectedPillar === 'study') return Math.max(targetStudy * 1.25, studyMinutes * 1.2, 200);
    if (selectedPillar === 'reading') return Math.max(targetReading * 1.25, readingPages * 1.2, 40);
    if (selectedPillar === 'screentime') return Math.max(maxScreenTime * 1.4, screenMinutes * 1.2, 120);
    if (selectedPillar === 'custom' && customTask?.isConfigured) return Math.max(customTask.target * 1.25, customTask.current * 1.2, 50);
    return 100;
  }, [hasInputs, selectedPillar, targetWorkout, workoutMinutes, targetStudy, studyMinutes, targetReading, readingPages, maxScreenTime, screenMinutes, customTask]);

  // Convert points to SVG coordinate strings
  const { userPathD, targetPathD, projectedPathD, areaPathD, svgCoords } = useMemo(() => {
    if (!hasInputs || graphPoints.length === 0) {
      return { userPathD: '', targetPathD: '', projectedPathD: '', areaPathD: '', svgCoords: [] };
    }

    const coords = graphPoints.map((pt, i) => {
      const x = paddingX + (i / (graphPoints.length - 1)) * chartWidth;
      const yUser = paddingY + chartHeight - (Math.min(pt.userVal, maxY) / maxY) * chartHeight;
      const yTarget = paddingY + chartHeight - (Math.min(pt.targetVal, maxY) / maxY) * chartHeight;
      const yProj = paddingY + chartHeight - (Math.min(pt.projectedVal, maxY) / maxY) * chartHeight;
      return { x, yUser, yTarget, yProj, ...pt };
    });

    // Build smooth curves
    const buildPath = (key: 'yUser' | 'yTarget' | 'yProj') => {
      return coords.reduce((acc, curr, idx, arr) => {
        if (idx === 0) return `M ${curr.x} ${curr[key]}`;
        const prev = arr[idx - 1];
        const cpX1 = prev.x + (curr.x - prev.x) / 2;
        const cpY1 = prev[key];
        const cpX2 = prev.x + (curr.x - prev.x) / 2;
        const cpY2 = curr[key];
        return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr[key]}`;
      }, '');
    };

    const userPath = buildPath('yUser');
    const targetPath = buildPath('yTarget');
    const projPath = buildPath('yProj');

    // Area path under user curve
    const bottomY = paddingY + chartHeight;
    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    const areaPath = `${userPath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

    return {
      userPathD: userPath,
      targetPathD: targetPath,
      projectedPathD: projPath,
      areaPathD: areaPath,
      svgCoords: coords,
    };
  }, [hasInputs, graphPoints, chartWidth, chartHeight, paddingX, paddingY, maxY]);

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Header & Pillar Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: activePersona.accentColor }} />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-mono">
              TRAJECTORY GRAPH PROJECTION // {activePersona.name} IDEOLOGY
            </h3>
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${activePersona.accentColor}20`,
                borderColor: `${activePersona.accentColor}40`,
                color: activePersona.accentColor,
              }}
            >
              {activePersona.tag}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-dimensional comparison between your logged baseline pacing and the archetype's prescribed discipline standard.
          </p>
        </div>

        {/* Pillar Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setSelectedPillar('all')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedPillar === 'all'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Pillars
          </button>
          <button
            onClick={() => setSelectedPillar('workout')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedPillar === 'workout'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Workout
          </button>
          <button
            onClick={() => setSelectedPillar('study')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedPillar === 'study'
                ? 'bg-cyan-500 text-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Study
          </button>
          <button
            onClick={() => setSelectedPillar('reading')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedPillar === 'reading'
                ? 'bg-purple-500 text-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reading
          </button>
          <button
            onClick={() => setSelectedPillar('screentime')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedPillar === 'screentime'
                ? 'bg-red-500 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Screen Time
          </button>
          {customTask?.isConfigured && (
            <button
              onClick={() => setSelectedPillar('custom')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer truncate max-w-[140px] ${
                selectedPillar === 'custom'
                  ? 'bg-amber-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={customTask.name}
            >
              {customTask.name}
            </button>
          )}
        </div>
      </div>

      {/* Main Graph Visualization Container */}
      <div 
        className="relative w-full rounded-2xl bg-[#06080C] border p-4 sm:p-6 overflow-hidden shadow-2xl transition-all duration-300"
        style={{
          borderColor: activePersona.accentColor + '40',
          boxShadow: `0 0 35px -10px ${activePersona.glowColor}`,
        }}
      >
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: '3rem 3rem',
          }}
        />

        {/* Legend Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
              <span className="text-white font-semibold">User Baseline Pacing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: activePersona.accentColor }} />
              <span className="text-slate-300 font-semibold">{activePersona.name} Target Quota</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-t-2 border-emerald-400" />
              <span className="text-emerald-400">Projected Compounding Trajectory</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>HORIZON: 24H DAILY COMPOSITION</span>
          </div>
        </div>

        {/* Graph Display Area */}
        <div className="relative w-full overflow-x-auto">
          {!hasInputs ? (
            /* BLANK ZERO-STATE AS EXPLICITLY REQUIRED */
            <div className="relative w-full h-[260px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/40 text-center p-6 space-y-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xs border"
                style={{
                  backgroundColor: `${activePersona.accentColor}15`,
                  borderColor: `${activePersona.accentColor}40`,
                  color: activePersona.accentColor,
                }}
              >
                <TrendingUp className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1">
                <div className="text-xs sm:text-sm font-mono font-bold uppercase text-white tracking-wider">
                  [ TELEMETRY BUFFER EMPTY // GRAPH PROJECTION BLANK ]
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No activity inputs detected for today. As soon as you log workouts, study blocks, reading pages, or screen time, the graph will immediately calculate your baseline growth and project your trajectory against {activePersona.name}'s standards.
                </p>
              </div>

              {/* Quick Log Starter Triggers */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => onQuickLog('workout', 30)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log +30m Workout</span>
                </button>
                <button
                  onClick={() => onQuickLog('study', 45)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log +45m Study</span>
                </button>
                <button
                  onClick={() => onQuickLog('reading', 20)}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log +20p Reading</span>
                </button>
                <button
                  onClick={() => onQuickLog('screentime', 30)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log +30m Screen</span>
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE GRAPH WITH DYNAMIC BEZIER TRAJECTORY CURVES */
            <div className="relative min-w-[640px]">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-[260px] overflow-visible"
              >
                <defs>
                  {/* Subtle Gradient fill under User Baseline curve */}
                  <linearGradient id="userCurveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Archetype Target Glow */}
                  <filter id="accentGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Y-Axis Horizontal Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                  const y = paddingY + chartHeight - frac * chartHeight;
                  const labelVal = Math.round(frac * maxY);
                  return (
                    <g key={idx}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[10px] font-mono fill-slate-500"
                      >
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Milestone Vertical Labels */}
                {timeCheckpoints.map((time, idx) => {
                  const x = paddingX + (idx / (timeCheckpoints.length - 1)) * chartWidth;
                  return (
                    <g key={idx}>
                      <line
                        x1={x}
                        y1={paddingY}
                        x2={x}
                        y2={paddingY + chartHeight}
                        stroke="rgba(255, 255, 255, 0.04)"
                      />
                      <text
                        x={x}
                        y={paddingY + chartHeight + 18}
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-slate-400"
                      >
                        {time}
                      </text>
                    </g>
                  );
                })}

                {/* Area under user curve */}
                {areaPathD && (
                  <path d={areaPathD} fill="url(#userCurveGradient)" />
                )}

                {/* Archetype Prescribed Benchmark Line (Dashed) */}
                {targetPathD && (
                  <path
                    d={targetPathD}
                    fill="none"
                    stroke={activePersona.accentColor}
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    opacity="0.85"
                  />
                )}

                {/* Projected Compounding Trajectory Line (Emerald) */}
                {projectedPathD && (
                  <path
                    d={projectedPathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    opacity="0.95"
                  />
                )}

                {/* Actual User Baseline Curve (Cyan / Solid with Glow) */}
                {userPathD && (
                  <path
                    d={userPathD}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#accentGlow)"
                  />
                )}

                {/* Interactive Checkpoint Dots */}
                {svgCoords.map((pt, i) => (
                  <g key={i}>
                    {/* User Point Dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.yUser}
                      r="4.5"
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-transform hover:scale-150"
                      onMouseEnter={() => {
                        setHoveredPoint({
                          label: pt.time,
                          userVal: pt.userVal,
                          targetVal: pt.targetVal,
                          projectedVal: pt.projectedVal,
                          x: pt.x,
                          y: pt.yUser,
                        });
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />

                    {/* Target Benchmark Dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.yTarget}
                      r="3.5"
                      fill={activePersona.accentColor}
                      opacity="0.9"
                    />
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip */}
              {hoveredPoint && (
                <div
                  className="absolute z-30 pointer-events-none p-2.5 rounded-xl bg-black/90 border border-white/20 text-xs font-mono shadow-xl -translate-x-1/2 -translate-y-full mb-3"
                  style={{
                    left: `${hoveredPoint.x}px`,
                    top: `${hoveredPoint.y}px`,
                  }}
                >
                  <div className="font-bold text-white border-b border-white/10 pb-1 mb-1">
                    Checkpoint: {hoveredPoint.label}
                  </div>
                  <div className="flex justify-between gap-3 text-cyan-400">
                    <span>Current Baseline:</span>
                    <strong>{hoveredPoint.userVal}</strong>
                  </div>
                  <div className="flex justify-between gap-3 text-slate-300">
                    <span>{activePersona.name} Quota:</span>
                    <strong style={{ color: activePersona.accentColor }}>{hoveredPoint.targetVal}</strong>
                  </div>
                  <div className="flex justify-between gap-3 text-emerald-400">
                    <span>Projected Trajectory:</span>
                    <strong>{hoveredPoint.projectedVal}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Archetype Ideology & Habit Corrective Remarks Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-white tracking-wider">
            <Shield className="w-4 h-4" style={{ color: activePersona.accentColor }} />
            <span>ARCHETYPE DIAGNOSTIC MATRIX // HABIT EVALUATION & CORRECTION</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            EVALUATOR: {activePersona.quoteAttribution}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Workout Habit Evaluation */}
          <div 
            className="p-4 rounded-xl border bg-black/50 space-y-2.5 transition-all"
            style={{
              borderColor: evaluations.workout.status === 'approved' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white font-mono uppercase">
                  {evaluations.workout.label}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                evaluations.workout.status === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {evaluations.workout.status === 'approved' ? 'APPROVED' : 'CORRECTION REQUIRED'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Pacing: {evaluations.workout.current} / {evaluations.workout.target} {evaluations.workout.unit}</span>
                <span className="font-bold text-white">{evaluations.workout.pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    evaluations.workout.status === 'approved' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, evaluations.workout.pct)}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-300 italic pl-2.5 border-l-2" style={{ borderColor: activePersona.accentColor }}>
              "{evaluations.workout.remark}"
            </p>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => onQuickLog('workout', 15)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>+15m Conditioning</span>
              </button>
            </div>
          </div>

          {/* 2. Study Habit Evaluation */}
          <div 
            className="p-4 rounded-xl border bg-black/50 space-y-2.5 transition-all"
            style={{
              borderColor: evaluations.study.status === 'approved' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono uppercase">
                  {evaluations.study.label}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                evaluations.study.status === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {evaluations.study.status === 'approved' ? 'APPROVED' : 'CORRECTION REQUIRED'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Pacing: {evaluations.study.current} / {evaluations.study.target} {evaluations.study.unit}</span>
                <span className="font-bold text-white">{evaluations.study.pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    evaluations.study.status === 'approved' ? 'bg-cyan-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, evaluations.study.pct)}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-300 italic pl-2.5 border-l-2" style={{ borderColor: activePersona.accentColor }}>
              "{evaluations.study.remark}"
            </p>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => onQuickLog('study', 30)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3 text-cyan-400" />
                <span>+30m Study Block</span>
              </button>
            </div>
          </div>

          {/* 3. Reading Habit Evaluation */}
          <div 
            className="p-4 rounded-xl border bg-black/50 space-y-2.5 transition-all"
            style={{
              borderColor: evaluations.reading.status === 'approved' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white font-mono uppercase">
                  {evaluations.reading.label}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                evaluations.reading.status === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {evaluations.reading.status === 'approved' ? 'APPROVED' : 'CORRECTION REQUIRED'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Pacing: {evaluations.reading.current} / {evaluations.reading.target} {evaluations.reading.unit}</span>
                <span className="font-bold text-white">{evaluations.reading.pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    evaluations.reading.status === 'approved' ? 'bg-purple-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, evaluations.reading.pct)}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-300 italic pl-2.5 border-l-2" style={{ borderColor: activePersona.accentColor }}>
              "{evaluations.reading.remark}"
            </p>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => onQuickLog('reading', 10)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3 text-purple-400" />
                <span>+10 Pages</span>
              </button>
            </div>
          </div>

          {/* 4. Screen Time Friction & Leakage Evaluation */}
          <div 
            className="p-4 rounded-xl border bg-black/50 space-y-2.5 transition-all"
            style={{
              borderColor: evaluations.screentime.status === 'approved' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.6)',
              backgroundColor: evaluations.screentime.status === 'approved' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(239, 68, 68, 0.05)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-white font-mono uppercase">
                  {evaluations.screentime.label}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                evaluations.screentime.status === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {evaluations.screentime.status === 'approved' ? 'WITHIN LIMIT' : 'EXCESSIVE LEAK'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Current Drag: {evaluations.screentime.current}m (Cap: {evaluations.screentime.target}m)</span>
                <span className={`font-bold ${evaluations.screentime.excess > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {evaluations.screentime.excess > 0 ? `+${evaluations.screentime.excess}m LEAK` : 'OPTIMAL'}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    evaluations.screentime.excess > 0 ? 'bg-red-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, evaluations.screentime.pct)}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-300 italic pl-2.5 border-l-2" style={{ borderColor: activePersona.accentColor }}>
              "{evaluations.screentime.remark}"
            </p>

            <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Drag multiplier: {activePersona.frictionMultiplier}x</span>
              <button
                onClick={() => onQuickLog('screentime', 15)}
                className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-[10px] uppercase font-bold cursor-pointer"
              >
                +15m Screen Log
              </button>
            </div>
          </div>

          {/* 5. Pillar 05 Custom Task Evaluation (Linked to Archetype Affinity) */}
          <div 
            className="p-4 rounded-xl border bg-black/50 space-y-2.5 transition-all md:col-span-2"
            style={{
              borderColor: customTask?.isConfigured 
                ? (PRELOADED_ACTIVITIES.find(a => a.id === customTask.templateId)?.affinities[activePersona.id]?.boost ?? 0) >= 0 
                  ? 'rgba(16, 185, 129, 0.4)' 
                  : 'rgba(239, 68, 68, 0.4)'
                : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            {customTask?.isConfigured ? (() => {
              const template = PRELOADED_ACTIVITIES.find(a => a.id === customTask.templateId) || PRELOADED_ACTIVITIES[0];
              const affinity = template.affinities[activePersona.id];
              const pct = Math.round((customTask.current / (customTask.target || 1)) * 100);

              return (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white font-mono uppercase">
                        PILLAR 05: {customTask.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (Baseline: {template.title})
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      affinity.reaction === 'synergy'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : affinity.reaction === 'deplete'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {affinity.reaction === 'synergy' ? `🔥 SYNERGY BOOST (+${affinity.boost}%)` :
                       affinity.reaction === 'deplete' ? `⚠️ FRICTION PENALTY (${affinity.boost}%)` :
                       `⭐ UNIVERSAL DISCIPLINE (+${affinity.boost}%)`}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Pacing: {customTask.current} / {customTask.target} {customTask.unit}</span>
                      <span className="font-bold text-white">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          affinity.reaction === 'deplete' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic pl-2.5 border-l-2" style={{ borderColor: activePersona.accentColor }}>
                    "{affinity.remark}"
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{affinity.verdict}</span>
                    <button
                      onClick={() => onQuickLog('custom', Math.max(1, Math.round(customTask.target * 0.25)))}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3 text-amber-400" />
                      <span>+25% Progress</span>
                    </button>
                  </div>
                </>
              );
            })() : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left py-1">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase justify-center sm:justify-start">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>Pillar 05: Custom Task Unassigned</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure a custom protocol in the 5 Pillars tab to link your routine with archetype synergy points.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400">
                  AWAITING ASSIGNMENT
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
