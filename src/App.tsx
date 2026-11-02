/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, Layers, Terminal, Sparkles, X, ChevronRight, 
  Activity, Cpu, Sliders, ShieldCheck, Dumbbell, BookOpen, Smartphone, 
  Target, Flame, Shield, Zap, TrendingUp, CheckCircle2, AlertTriangle, 
  Plus, Clock, RefreshCw, BarChart3, Radio, ArrowRightLeft, Lock, Check,
  Cloud, CloudOff, LogIn, LogOut, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  signInWithGoogle, 
  signInGuest, 
  signOutUser, 
  saveUserProfile, 
  loadUserProfile, 
  saveDailyTelemetry, 
  loadDailyTelemetry 
} from './firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LoginGateway } from './components/LoginGateway.tsx';
import { TrajectoryGraphProjection } from './components/TrajectoryGraphProjection.tsx';
import { CustomPillarModal } from './components/CustomPillarModal.tsx';
import { CustomTaskPillar, PRELOADED_ACTIVITIES } from './types/pillar5.ts';

// Exact IMAGES array specified by user
const IMAGES = [
  { src: 'https://ibb.co/C5jx8zC3', bg: '#2C1212', panel: '#3D1B1B' },
  { src: 'https://ibb.co/nMS99DVB', bg: '#111518', panel: '#1E252B' },
  { src: 'https://ibb.co/S4GdXDgG', bg: '#1A232C', panel: '#24323D' },
  { src: 'https://ibb.co/VY1nF04y', bg: '#120A0A', panel: '#241010' },
];

// High-resolution direct image map matching the ImgBB embeds for zero-fail rendering
const DIRECT_IMG_MAP: Record<string, string> = {
  'https://ibb.co/C5jx8zC3': 'https://i.ibb.co/xSnVLD9t/HULK-BUSTER.jpg',
  'https://ibb.co/nMS99DVB': 'https://i.ibb.co/r2JYYZL3/Screenshot-2026-11-02-151131.png',
  'https://ibb.co/S4GdXDgG': 'https://i.ibb.co/8LtdDnwt/download-5.jpg',
  'https://ibb.co/VY1nF04y': 'https://i.ibb.co/fdg63VwR/download-4.jpg',
};

export type PersonaId = 'VADER' | 'RONALDO' | 'STARK' | 'BATMAN';

interface FigurineMeta {
  title: string;
  heroKicker: string;
  subtitle: string;
  series: string;
  scale: string;
  operatorId: PersonaId;
  trajectoryMock: string;
  diagnosticNotice: string;
}

const FIGURINE_META: FigurineMeta[] = [
  { 
    title: 'MK-XLIV HULKBUSTER',
    heroKicker: 'TONY STARK // INDUSTRIAL ENGINEER', 
    subtitle: 'Heavy Siege Exo-Suit // Stark Tech', 
    series: 'ARCHETYPE 01 · STARK', 
    scale: '1:6 Scale Heavy Armor',
    operatorId: 'STARK',
    trajectoryMock: "You think logging 45 minutes of study makes you a prodigy? I synthesized a new element and built an Arc Reactor in an Afghan cave with a box of scraps while you were doom-scrolling feeds. Your 'daily discipline' wouldn't generate enough wattage to power my boot repulsors. Upgrade your cognitive bandwidth or remain a civilian.",
    diagnosticNotice: 'STARK TELEMETRY: System running cold. Pacing output is 94.2% below Stark prototype specs.'
  },
  { 
    title: 'CYBER RONIN ZERO', 
    heroKicker: 'BRUCE WAYNE // THE DARK KNIGHT', 
    subtitle: 'Tactical Operative // Gotham Stealth', 
    series: 'ARCHETYPE 02 · BATMAN', 
    scale: '1:6 Scale Stealth Alloy',
    operatorId: 'BATMAN',
    trajectoryMock: "You complain about waking up early and craving rest? I clawed my way out of the Pit and trained in Himalayan blizzards with fractured ribs. Your discipline shatters the second your phone flickers in the dark. The cowl demands blood and uncompromising silence—not comfortable excuses.",
    diagnosticNotice: 'GOTHAM SURVEILLANCE: Softness detected. The shadows do not negotiate with your fatigue.'
  },
  { 
    title: 'VALKYRIE MECHA PRIME', 
    heroKicker: 'CRISTIANO RONALDO // THE ELITE MACHINE', 
    subtitle: 'Aerial Volume Driver // Athletic Peak', 
    series: 'ARCHETYPE 03 · RONALDO', 
    scale: '1:6 Scale Peak Machine',
    operatorId: 'RONALDO',
    trajectoryMock: "You did 30 minutes in the gym and felt satisfied? Pathetic. While you were resting between sets checking notifications, I was knocking down 1,000 abdominal repetitions in an ice bath. Talent without ruthless, obsessive repetition is worthless. Stop negotiating with your sweat. SIUUU!",
    diagnosticNotice: 'CR7 METRIC AUDIT: Severe volume deficiency. Nobody outworks me while I am breathing.'
  },
  { 
    title: 'IRON CENTURION PROTO', 
    heroKicker: 'DARTH VADER // THE DARK LORD', 
    subtitle: 'Obsidian Dreadnought // Dark Vanguard', 
    series: 'ARCHETYPE 04 · VADER', 
    scale: '1:6 Scale Obsidian Sith',
    operatorId: 'VADER',
    trajectoryMock: "I find your lack of discipline disturbing. You allow trivial screen flickers to conquer your attention, yet you fantasize about mastering your destiny. Your weakness is palpable. Do not flatter yourself into believing you walk my trajectory—your resolve would burn to ash on the shores of Mustafar.",
    diagnosticNotice: 'IMPERIAL INQUISITION: Severe time leakage. Insubordination against the objective will not be tolerated.'
  },
];

interface PersonaQuotas {
  workout: number;
  study: number;
  reading: number;
  maxScreen: number;
}

interface SpecializedLabels {
  workout: string;
  study: string;
  reading: string;
  screentime: string;
}

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
  quotas: PersonaQuotas;
  labels: SpecializedLabels;
  associatedFigurineIndex: number;
}

const PERSONAS: Record<PersonaId, PersonaConfig> = {
  VADER: {
    id: 'VADER',
    name: 'Darth Vader',
    alias: 'THE DARK LORD // FATALISTIC DISCIPLINE',
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.35)',
    badgeClass: 'bg-red-950/60 border-red-500/40 text-red-400',
    headerBorder: 'border-red-500/30',
    feedbackQuote: 'Your screen time leakage compromises the objective. Purge distractions. The Emperor will not tolerate further hesitation.',
    tacticalDirective: 'Zero tolerance for excuses. Reclaim 90 minutes of frivolous digital sedation and redirect it into physical armor.',
    tag: 'FATALISTIC PURGE',
    frictionMultiplier: 1.8,
    weightFocus: 'Screen Time Elimination',
    quoteAttribution: 'Lord Vader // Supreme Commander',
    signatureRequirement: '90m Max Screen Limit & Silent Isolation',
    psychologicalApproach: 'Fatalistic and ruthlessly uncompromising. Treats any minute wasted as insubordination against your supreme destiny.',
    quotas: {
      workout: 60,
      study: 150,
      reading: 30,
      maxScreen: 90,
    },
    labels: {
      workout: 'Combat Conditioning',
      study: 'Holocron Archive Study',
      reading: 'Sith Meditation',
      screentime: 'Rebellion Distractions (Screen Leak)',
    },
    associatedFigurineIndex: 3,
  },
  RONALDO: {
    id: 'RONALDO',
    name: 'Cristiano Ronaldo',
    alias: 'THE ELITE MACHINE // MAXIMUM OUTPUT',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    badgeClass: 'bg-sky-950/60 border-sky-400/40 text-sky-300',
    headerBorder: 'border-sky-500/30',
    feedbackQuote: 'Good is never enough. Add 20 minutes to tonight\'s session. Excellence is a standard you earn with blood and sweat. SIUUU!',
    tacticalDirective: 'Pacing is lagging on volume. When everyone else rests, you push 2 more sets. Relentless execution is our baseline.',
    tag: 'RELENTLESS WILL',
    frictionMultiplier: 1.4,
    weightFocus: 'High-Volume Overdrive',
    quoteAttribution: 'CR7 // Peak Athletic Drive',
    signatureRequirement: '75m High-Volume Workout & 500 Reps',
    psychologicalApproach: 'Obsessive repetition driver. Demands supreme physical conditioning, athletic volume, and unmatched work ethic.',
    quotas: {
      workout: 75,
      study: 120,
      reading: 25,
      maxScreen: 120,
    },
    labels: {
      workout: 'Pitch & Gym Sprints',
      study: 'Tactical Match Review',
      reading: 'Mentality Reading',
      screentime: 'Media Distraction',
    },
    associatedFigurineIndex: 2,
  },
  STARK: {
    id: 'STARK',
    name: 'Tony Stark',
    alias: 'HULKBUSTER // INDUSTRIAL ENGINEER',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    badgeClass: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
    headerBorder: 'border-amber-500/30',
    feedbackQuote: 'System overheating on screen time. Reroute power to the books. Let\'s fix the mechanical drag before the reactor burns out.',
    tacticalDirective: 'Telemetry bottleneck detected in non-productive screen loop. Channel 1.21 gigawatts into continuous deep learning modules.',
    tag: 'ARC OPTIMIZATION',
    frictionMultiplier: 1.5,
    weightFocus: 'Bandwidth & Efficiency',
    quoteAttribution: 'Tony Stark // Stark Industries',
    signatureRequirement: '210m Deep Study & 60-Page Technical Reading',
    psychologicalApproach: 'High-bandwidth industrial engineer. Treats biological limits as hardware constraints to be upgraded through extreme deep work.',
    quotas: {
      workout: 45,
      study: 210,
      reading: 60,
      maxScreen: 120,
    },
    labels: {
      workout: 'Armor Fabrication Drills',
      study: 'Quantum Physics Study',
      reading: 'Blueprint Schematics',
      screentime: 'StarkNet Terminal',
    },
    associatedFigurineIndex: 0,
  },
  BATMAN: {
    id: 'BATMAN',
    name: 'Bruce Wayne',
    alias: 'THE DARK KNIGHT // GOTHAM SLATE',
    accentColor: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.35)',
    badgeClass: 'bg-slate-900/80 border-slate-500/40 text-slate-200',
    headerBorder: 'border-slate-500/30',
    feedbackQuote: 'It\'s not who you are underneath, it\'s your daily execution that defines you. The shadows demand relentless grit.',
    tacticalDirective: 'Cut the noise. The city doesn\'t sleep, and discipline isn\'t negotiated. Finish the reading quota before nocturnal patrol.',
    tag: 'SILENT DISCIPLINE',
    frictionMultiplier: 1.6,
    weightFocus: 'Unyielding Mental Armor',
    quoteAttribution: 'The Batman // Gotham Ops',
    signatureRequirement: 'Balanced Discipline & 60m Nocturnal Screen-Lock',
    psychologicalApproach: 'Grim, uncompromising nocturnal discipline. Balances heavy kinetic armor with stealth focus and a zero-compromise screen blackout.',
    quotas: {
      workout: 60,
      study: 180,
      reading: 40,
      maxScreen: 60,
    },
    labels: {
      workout: 'CQC Combat Drills',
      study: 'Forensic Analysis Study',
      reading: 'Gotham Case Files',
      screentime: 'Surveillance Feed Leak',
    },
    associatedFigurineIndex: 1,
  },
};

interface LogEntry {
  id: string;
  category: 'workout' | 'study' | 'reading' | 'screentime' | 'custom';
  title: string;
  value: number;
  time: string;
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  
  // Modal states: Gateway vs HUD
  const [gatewayModalOpen, setGatewayModalOpen] = useState<boolean>(false);
  const [hudModalOpen, setHudModalOpen] = useState<boolean>(false);
  
  // Persona States
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>('VADER');
  const [previewPersonaId, setPreviewPersonaId] = useState<PersonaId>('VADER');
  
  const [hudTab, setHudTab] = useState<'hud' | 'alternatePath' | 'logger' | 'projection'>('hud');
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Auth & Cloud Sync States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<'synced' | 'saving' | 'offline'>('synced');

  // Dynamic Targets locked by active persona
  const [targetWorkout, setTargetWorkout] = useState<number>(PERSONAS.VADER.quotas.workout);
  const [targetStudy, setTargetStudy] = useState<number>(PERSONAS.VADER.quotas.study);
  const [targetReading, setTargetReading] = useState<number>(PERSONAS.VADER.quotas.reading);
  const [maxScreenTime, setMaxScreenTime] = useState<number>(PERSONAS.VADER.quotas.maxScreen);

  // Core Metric States (INITIALIZED CLEANLY AT ZERO STATE AS SPECIFIED)
  const [workoutMinutes, setWorkoutMinutes] = useState<number>(0);
  const [studyMinutes, setStudyMinutes] = useState<number>(0);
  const [readingPages, setReadingPages] = useState<number>(0);
  const [screenMinutes, setScreenMinutes] = useState<number>(0);
  const [macroProgress, setMacroProgress] = useState<number>(0);

  // Pillar 05: Custom Tactical Objective State & Modal
  const [customTask, setCustomTask] = useState<CustomTaskPillar>({
    name: 'Custom Tactical Objective',
    templateId: 'cold_plunge',
    target: 10,
    current: 0,
    unit: 'min',
    isConfigured: false,
  });
  const [customPillarModalOpen, setCustomPillarModalOpen] = useState<boolean>(false);

  // Alternate Path Simulator States
  const [reclaimScreenSlider, setReclaimScreenSlider] = useState<number>(45);
  const [reallocateTarget, setReallocateTarget] = useState<'study' | 'workout'>('study');

  // Quick Action Logs
  const [actionLogs, setActionLogs] = useState<LogEntry[]>([]);

  // Form input for new entry
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogCategory, setNewLogCategory] = useState<'workout' | 'study' | 'reading' | 'screentime' | 'custom'>('study');
  const [newLogAmount, setNewLogAmount] = useState<number>(30);

  const activePersona = PERSONAS[activePersonaId];
  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Firebase Auth Listener & Auto-Load Cloud State
  useEffect(() => {
    setIsAuthLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        setSyncState('saving');
        try {
          const profile = await loadUserProfile(user.uid);
          if (profile?.active_persona && PERSONAS[profile.active_persona as PersonaId]) {
            const savedPersonaId = profile.active_persona as PersonaId;
            setActivePersonaId(savedPersonaId);
            setTargetWorkout(PERSONAS[savedPersonaId].quotas.workout);
            setTargetStudy(PERSONAS[savedPersonaId].quotas.study);
            setTargetReading(PERSONAS[savedPersonaId].quotas.reading);
            setMaxScreenTime(PERSONAS[savedPersonaId].quotas.maxScreen);
            setActiveIndex(PERSONAS[savedPersonaId].associatedFigurineIndex);
          }

          const todayData = await loadDailyTelemetry(user.uid, todayDateStr);
          if (todayData) {
            setWorkoutMinutes(todayData.workout_minutes ?? 0);
            setStudyMinutes(todayData.study_minutes ?? 0);
            setReadingPages(todayData.reading_pages ?? 0);
            setScreenMinutes(todayData.screen_minutes ?? 0);
            setMacroProgress(todayData.macro_progress ?? 0);
            if (todayData.custom_task) {
              setCustomTask(todayData.custom_task);
            }
            if (Array.isArray(todayData.action_logs)) {
              setActionLogs(todayData.action_logs);
            }
          }
          setSyncState('synced');
        } catch (err) {
          console.warn('Could not load user data from Firestore:', err);
          setSyncState('offline');
        }
      } else {
        setSyncState('offline');
      }
    });

    return () => unsubscribe();
  }, [todayDateStr]);

  // Auth Action Handlers
  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in was cancelled. Please click Initialize with Google again or use Guest Protocol.');
      } else if (err?.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by browser. Please enable popups or use Guest Protocol.');
      } else {
        setAuthError(err?.message || 'Authentication failed. You can use Guest Protocol to proceed.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      await signInGuest();
    } catch (err: any) {
      console.error('Guest sign-in error:', err);
      setAuthError('Failed to initialize Guest Protocol. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setGatewayModalOpen(false);
      setHudModalOpen(false);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Live Calculated Raw Execution Score based on current 5 pillars and active quotas
  const executionScore = useMemo(() => {
    const hasAnyActivity = workoutMinutes > 0 || studyMinutes > 0 || readingPages > 0 || screenMinutes > 0 || (customTask.isConfigured && customTask.current > 0);
    if (!hasAnyActivity) {
      return 0;
    }

    const workoutPct = Math.min(1.2, workoutMinutes / (targetWorkout || 60));
    const studyPct = Math.min(1.2, studyMinutes / (targetStudy || 180));
    const readingPct = Math.min(1.2, readingPages / (targetReading || 30));
    
    const screenExcess = Math.max(0, screenMinutes - maxScreenTime);
    const screenPenalty = (screenExcess / 60) * 14 * activePersona.frictionMultiplier;

    // Pillar 5: Custom Task Progress & Archetype Affinity Boost / Deplete Mechanism
    let customTaskPoints = 0;
    let affinityAdjustment = 0;

    if (customTask.isConfigured) {
      const taskRatio = Math.min(1.2, customTask.current / (customTask.target || 1));
      customTaskPoints = taskRatio * 15;
      
      const template = PRELOADED_ACTIVITIES.find((a) => a.id === customTask.templateId);
      if (template) {
        const affinity = template.affinities[activePersonaId];
        if (affinity) {
          // Boosts execution points if archetype loves it, or depletes/applies friction if archetype dislikes it
          affinityAdjustment = (affinity.boost / 100) * 10 * taskRatio;
        }
      }
    }

    const baseScore = (workoutPct * 28) + (studyPct * 32) + (readingPct * 18) + (customTask.isConfigured ? customTaskPoints : 8) + affinityAdjustment;
    const finalScore = Math.max(0, Math.min(100, Math.round(baseScore - screenPenalty)));
    return finalScore;
  }, [workoutMinutes, targetWorkout, studyMinutes, targetStudy, readingPages, targetReading, screenMinutes, maxScreenTime, customTask, activePersonaId, activePersona.frictionMultiplier]);

  // Debounced Cloud Sync to Firestore on state change
  useEffect(() => {
    if (!currentUser) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    setSyncState('saving');
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await saveDailyTelemetry(currentUser.uid, todayDateStr, {
          workout_minutes: workoutMinutes,
          study_minutes: studyMinutes,
          reading_pages: readingPages,
          screen_minutes: screenMinutes,
          macro_progress: macroProgress,
          execution_score: executionScore,
          persona_id: activePersonaId,
          action_logs: actionLogs,
          custom_task: customTask,
        } as any);
        setSyncState('synced');
      } catch (e) {
        setSyncState('offline');
      }
    }, 800);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [workoutMinutes, studyMinutes, readingPages, screenMinutes, macroProgress, executionScore, activePersonaId, actionLogs, customTask, currentUser, todayDateStr]);

  // Initiate Protocol: Locks in persona and updates Firestore
  const handleInitiateProtocol = async (personaId: PersonaId) => {
    const config = PERSONAS[personaId];
    setActivePersonaId(personaId);
    setTargetWorkout(config.quotas.workout);
    setTargetStudy(config.quotas.study);
    setTargetReading(config.quotas.reading);
    setMaxScreenTime(config.quotas.maxScreen);
    setActiveIndex(config.associatedFigurineIndex);
    
    if (currentUser) {
      saveUserProfile(currentUser.uid, {
        active_persona: personaId,
        target_workout: config.quotas.workout,
        target_study: config.quotas.study,
        target_reading: config.quotas.reading,
        max_screentime: config.quotas.maxScreen,
        macro_progress: macroProgress,
      }).catch(() => {});
    }

    setGatewayModalOpen(false);
    setHudModalOpen(true);
  };

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const direct = DIRECT_IMG_MAP[item.src] || item.src;
      const imgDirect = new Image();
      imgDirect.src = direct;
      const rawImg = new Image();
      rawImg.src = item.src;
    });
  }, []);

  // Navigation logic for hero carousel
  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % 4);
    } else {
      setActiveIndex((prev) => (prev + 3) % 4);
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [isAnimating]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gatewayModalOpen) {
        if (e.key === 'Escape') setGatewayModalOpen(false);
        return;
      }
      if (hudModalOpen) {
        if (e.key === 'Escape') setHudModalOpen(false);
        return;
      }
      if (e.key === 'ArrowLeft') {
        navigate('prev');
      } else if (e.key === 'ArrowRight') {
        navigate('next');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, hudModalOpen, gatewayModalOpen]);

  // Roles derived from activeIndex
  const roles = useMemo(() => {
    const center = activeIndex;
    const left = (activeIndex + 3) % 4;
    const right = (activeIndex + 1) % 4;
    const back = (activeIndex + 2) % 4;
    return { center, left, right, back };
  }, [activeIndex]);

  const getRoleForIndex = (index: number): 'center' | 'left' | 'right' | 'back' => {
    if (index === roles.center) return 'center';
    if (index === roles.left) return 'left';
    if (index === roles.right) return 'right';
    return 'back';
  };

  const getRoleStyles = (role: 'center' | 'left' | 'right' | 'back') => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 15,
          left: '50%',
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : '0px',
        };
      case 'left':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  // Alternate Path 30-Day Projections
  const alternateProjections = useMemo(() => {
    const hoursReclaimed30Days = ((reclaimScreenSlider * 30) / 60).toFixed(1);
    const addedStudyMinutesDaily = reallocateTarget === 'study' ? Math.round(reclaimScreenSlider * 0.8) : 0;
    const addedWorkoutMinutesDaily = reallocateTarget === 'workout' ? Math.round(reclaimScreenSlider * 0.7) : 0;
    
    const simulatedScreen = Math.max(0, screenMinutes - reclaimScreenSlider);
    const simWorkoutPct = Math.min(1.2, (workoutMinutes + addedWorkoutMinutesDaily) / (targetWorkout || 60));
    const simStudyPct = Math.min(1.2, (studyMinutes + addedStudyMinutesDaily) / (targetStudy || 180));
    const simReadingPct = Math.min(1.2, readingPages / (targetReading || 30));
    const simScreenExcess = Math.max(0, simulatedScreen - maxScreenTime);
    const simScreenPenalty = (simScreenExcess / 60) * 14 * activePersona.frictionMultiplier;
    const projectedScore = Math.max(0, Math.min(100, Math.round((simWorkoutPct * 30) + (simStudyPct * 35) + (simReadingPct * 20) + ((macroProgress / 100) * 15) - simScreenPenalty)));

    const daysAhead = Math.round((reclaimScreenSlider / 60) * 8.5);

    return {
      hoursReclaimed30Days,
      addedDaily: reallocateTarget === 'study' ? addedStudyMinutesDaily : addedWorkoutMinutesDaily,
      projectedScore,
      scoreDelta: projectedScore - executionScore,
      daysAhead,
    };
  }, [reclaimScreenSlider, reallocateTarget, studyMinutes, targetStudy, workoutMinutes, targetWorkout, readingPages, targetReading, screenMinutes, maxScreenTime, macroProgress, activePersona.frictionMultiplier, executionScore]);

  // Handle logging a new action entry
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTitle.trim()) return;

    const newEntry: LogEntry = {
      id: Date.now().toString(),
      category: newLogCategory,
      title: newLogTitle.trim(),
      value: newLogAmount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActionLogs([newEntry, ...actionLogs]);

    if (newLogCategory === 'workout') setWorkoutMinutes((prev) => prev + newLogAmount);
    if (newLogCategory === 'study') setStudyMinutes((prev) => prev + newLogAmount);
    if (newLogCategory === 'reading') setReadingPages((prev) => prev + newLogAmount);
    if (newLogCategory === 'screentime') setScreenMinutes((prev) => prev + newLogAmount);
    if (newLogCategory === 'custom' && customTask.isConfigured) {
      setCustomTask((prev) => ({
        ...prev,
        current: Math.min(prev.target, prev.current + newLogAmount),
      }));
    }

    setNewLogTitle('');
  };

  const currentBg = IMAGES[activeIndex]?.bg || '#111518';
  const activeFigurine = FIGURINE_META[activeIndex];

  if (isAuthLoading) {
    return (
      <div 
        className="w-full h-screen bg-[#06080B] text-white flex flex-col items-center justify-center gap-4 select-none relative overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.35,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.3)]">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <div className="text-sm font-mono font-bold tracking-widest text-white uppercase">
              TACONIC DISCIPLINE OS // AUTHENTICATING
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Establishing handshake with Firebase Security Subsystem...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!currentUser ? (
        <motion.div
          key="auth-gateway"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full min-h-screen"
        >
          <LoginGateway
            onGoogleSignIn={handleGoogleSignIn}
            onGuestSignIn={handleGuestSignIn}
            isSigningIn={isSigningIn}
            authError={authError}
            onClearError={() => setAuthError(null)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="authenticated-terminal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="relative w-full overflow-hidden select-none"
          style={{
            backgroundColor: currentBg,
            transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        
        {/* 1. Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* 2. Carousel Images (Allocated behind RESOLUTE display text) */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          {IMAGES.map((imgItem, idx) => {
            const role = getRoleForIndex(idx);
            const roleStyle = getRoleStyles(role);
            const directUrl = DIRECT_IMG_MAP[imgItem.src] || imgItem.src;
            const meta = FIGURINE_META[idx];

            return (
              <div
                key={idx}
                className="pointer-events-auto"
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  transform: roleStyle.transform,
                  filter: roleStyle.filter,
                  opacity: roleStyle.opacity,
                  zIndex: roleStyle.zIndex,
                  left: roleStyle.left,
                  height: roleStyle.height,
                  bottom: roleStyle.bottom,
                  transition:
                    'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, filter, opacity',
                }}
              >
                {!failedImages[idx] ? (
                  <img
                    src={directUrl}
                    alt={meta.title}
                    draggable={false}
                    onError={() => {
                      setFailedImages((prev) => ({ ...prev, [idx]: true }));
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'bottom center',
                      userSelect: 'none',
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.65))',
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/60 to-transparent rounded-2xl border border-white/10 text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                      <Layers className="w-8 h-8 text-white/80" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-white">
                      {meta.title}
                    </span>
                    <span className="text-xs text-white/60 mt-1">{meta.scale}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Giant display text "RESOLUTE" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 25,
            top: '18%',
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(64px, 23vw, 360px)',
              fontWeight: 900,
              color: '#ffffff',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              textShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
            }}
          >
            RESOLUTE
          </span>
        </div>

        {/* 4. Top-left brand label "TOONHUB" */}
        <div
          className="absolute top-6 left-4 sm:left-8 flex items-center gap-3"
          style={{ zIndex: 60 }}
        >
          <div
            className="text-xs font-semibold uppercase text-white cursor-pointer hover:opacity-100 transition-opacity"
            style={{
              opacity: 0.9,
              letterSpacing: '0.18em',
            }}
          >
            TOONHUB
          </div>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="hidden sm:inline-block text-[11px] tracking-widest text-white/60 uppercase">
            OPERATOR: {activePersona.name}
          </span>
        </div>

        {/* Top-right operator gateway & HUD trigger button */}
        <div
          className="absolute top-6 right-4 sm:right-8 flex items-center gap-2 sm:gap-3"
          style={{ zIndex: 60 }}
        >
          {/* User Profile Badge & Sign Out Button */}
          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-mono text-slate-200 shadow-xl">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]"
                style={{
                  backgroundColor: `${activePersona.accentColor}25`,
                  color: activePersona.accentColor,
                  border: `1px solid ${activePersona.accentColor}50`,
                }}
              >
                {currentUser.isAnonymous ? 'G' : (currentUser.displayName ? currentUser.displayName[0] : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U'))}
              </div>
              <span className="hidden md:inline max-w-[130px] truncate text-[11px]">
                {currentUser.isAnonymous ? 'GUEST PROTOCOL' : (currentUser.displayName || currentUser.email)}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors pl-1.5 border-l border-white/15 cursor-pointer text-[11px]"
                title="Sign out and return to Login Gateway"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[10px] tracking-wider">SIGN OUT</span>
              </button>
            </div>
          )}

          {/* Cloud Sync State Chip */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300">
            {syncState === 'saving' ? (
              <>
                <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : syncState === 'synced' ? (
              <>
                <Cloud className="w-3 h-3 text-emerald-400" />
                <span>Firestore Synced</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3 h-3 text-slate-400" />
                <span>Local</span>
              </>
            )}
          </div>

          <button
            onClick={() => {
              setPreviewPersonaId(activePersonaId);
              setGatewayModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white hover:border-white/60 hover:bg-black/60 transition-all text-xs uppercase tracking-wider font-medium cursor-pointer shadow-lg"
            title="Launch Operator Gateway & Taconic HUD"
          >
            <Shield className="w-3.5 h-3.5" style={{ color: activePersona.accentColor }} />
            <span className="hidden sm:inline font-mono">GATEWAY // {activePersona.name}</span>
            <span className="sm:hidden font-mono">GATEWAY</span>
          </button>
        </div>

        {/* Center Figurine Quick Spec Badge (Floating subtly above the character base) */}
        <div
          className="absolute bottom-28 sm:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-opacity duration-500"
          style={{ zIndex: 30, opacity: isAnimating ? 0 : 0.95 }}
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs text-white/90 tracking-widest uppercase shadow-xl font-mono">
            <span style={{ color: PERSONAS[activeFigurine.operatorId].accentColor }}>
              {activeFigurine.heroKicker.split('//')[0].trim()}
            </span>
            <span>·</span>
            <span className="font-semibold text-white">{activeFigurine.title}</span>
            <span>·</span>
            <span className="text-white/60">{activeFigurine.scale}</span>
          </div>
        </div>

        {/* 5. Bottom-left archetype briefing & mocking trajectory + nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-16 sm:left-20"
          style={{
            zIndex: 60,
            maxWidth: isMobile ? '310px' : '450px',
          }}
        >
          {/* Figurine Archetype Kicker & Scale */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border tracking-wider shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: `${PERSONAS[activeFigurine.operatorId].accentColor}18`,
                borderColor: `${PERSONAS[activeFigurine.operatorId].accentColor}50`,
                color: PERSONAS[activeFigurine.operatorId].accentColor,
              }}
            >
              {activeFigurine.heroKicker}
            </span>
            <span className="text-[10px] font-mono text-white/50 tracking-widest hidden sm:inline">
              {activeFigurine.scale}
            </span>
          </div>

          {/* Figurine Title */}
          <p
            className="mb-2 text-base sm:text-[22px] font-bold uppercase tracking-tight text-white font-mono transition-all duration-300"
            style={{
              opacity: 0.98,
              letterSpacing: '0.01em',
            }}
          >
            {activeFigurine.title}
          </p>

          {/* Dynamic Mocking Trajectory Paragraph Briefing */}
          <div
            className="hidden sm:block text-xs text-slate-300 mb-4 leading-relaxed font-sans border-l-2 pl-3 py-1 transition-all duration-300 backdrop-blur-sm bg-black/30 rounded-r-lg"
            style={{
              borderColor: PERSONAS[activeFigurine.operatorId].accentColor,
            }}
          >
            <p className="italic text-white/90">
              "{activeFigurine.trajectoryMock}"
            </p>
            <div 
              className="text-[10px] font-mono mt-2 flex items-center gap-1.5 font-semibold"
              style={{ color: PERSONAS[activeFigurine.operatorId].accentColor }}
            >
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>{activeFigurine.diagnosticNotice}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('prev')}
              disabled={isAnimating}
              aria-label="Previous figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 disabled:opacity-50"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #ffffff',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>

            <button
              onClick={() => navigate('next')}
              disabled={isAnimating}
              aria-label="Next figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 disabled:opacity-50"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #ffffff',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "DISCOVER IT" -> Launches Operator Initialization Gateway */}
        <div
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <button
            onClick={() => {
              setPreviewPersonaId(activePersonaId);
              setGatewayModalOpen(true);
            }}
            className="flex items-center gap-2 sm:gap-3 uppercase transition-opacity duration-200 cursor-pointer group text-left"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              color: '#ffffff',
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.95';
            }}
          >
            <span>DISCOVER IT</span>
            <ArrowRight
              className="w-5 h-5 sm:w-8 sm:h-8 transition-transform group-hover:translate-x-1 duration-200"
              strokeWidth={2.25}
            />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. OPERATOR INITIALIZATION & SELECTION GATEWAY (FULL VIEWPORT) */}
      {/* ------------------------------------------------------------- */}
      {gatewayModalOpen && (
        <div
          className="fixed inset-0 z-[120] flex flex-col justify-between p-3 sm:p-6 md:p-8 bg-black/95 backdrop-blur-3xl overflow-y-auto animate-in fade-in duration-300"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Gateway Header */}
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-black text-white tracking-widest uppercase font-mono">
                  PROTOCOL INITIALIZATION // SELECT YOUR OPERATOR
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your psychological archetype. Each operator enforces distinct daily constraints, specialized activity units, and real-time cloud persistence.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentUser && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    {currentUser.isAnonymous ? 'G' : (currentUser.displayName ? currentUser.displayName[0] : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U'))}
                  </div>
                  <span className="max-w-[130px] truncate text-[11px]">
                    {currentUser.isAnonymous ? 'GUEST PROTOCOL' : (currentUser.displayName || currentUser.email)}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-slate-400 hover:text-red-400 transition-colors ml-1 cursor-pointer flex items-center gap-1"
                    title="Sign Out to Login Gateway"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden md:inline text-[10px]">SIGN OUT</span>
                  </button>
                </div>
              )}
              <button
                onClick={() => setGatewayModalOpen(false)}
                className="w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Gateway"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 4 Operator Cards Grid */}
          <div className="w-full max-w-7xl mx-auto my-auto py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(PERSONAS) as PersonaId[]).map((pId) => {
              const persona = PERSONAS[pId];
              const isSelected = previewPersonaId === pId;

              return (
                <div
                  key={pId}
                  onClick={() => setPreviewPersonaId(pId)}
                  className={`relative flex flex-col justify-between rounded-2xl p-5 border cursor-pointer transition-all duration-300 group ${
                    isSelected 
                      ? 'bg-gradient-to-b from-white/10 to-black/80 shadow-2xl scale-[1.02]' 
                      : 'bg-[#0A0D12] border-white/10 hover:border-white/25 hover:bg-white/5'
                  }`}
                  style={{
                    borderColor: isSelected ? persona.accentColor : undefined,
                    boxShadow: isSelected ? `0 0 35px -5px ${persona.glowColor}` : undefined,
                  }}
                >
                  {/* Top Bar: Icon, Name & Status Radio */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center font-black font-mono"
                        style={{
                          backgroundColor: `${persona.accentColor}20`,
                          color: persona.accentColor,
                          border: `1px solid ${persona.accentColor}60`,
                        }}
                      >
                        {pId === 'VADER' && <Shield className="w-6 h-6" />}
                        {pId === 'RONALDO' && <Zap className="w-6 h-6" />}
                        {pId === 'STARK' && <Cpu className="w-6 h-6" />}
                        {pId === 'BATMAN' && <Target className="w-6 h-6" />}
                      </div>

                      <div className="flex items-center gap-2">
                        {activePersonaId === pId && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                            ACTIVE
                          </span>
                        )}
                        <div 
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            isSelected 
                              ? 'border-white bg-white text-black' 
                              : 'border-white/20 bg-black/40'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>

                    {/* Title & Alias */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold text-white tracking-wide">
                        {persona.name}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                        {persona.alias}
                      </div>
                    </div>

                    {/* Signature Constraint Badge */}
                    <div 
                      className="px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-semibold tracking-wide mb-4 flex items-center gap-2"
                      style={{
                        backgroundColor: `${persona.accentColor}12`,
                        borderColor: `${persona.accentColor}40`,
                        color: persona.accentColor,
                      }}
                    >
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{persona.signatureRequirement}</span>
                    </div>

                    {/* Psychological Approach */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-4 min-h-[48px]">
                      {persona.psychologicalApproach}
                    </p>

                    {/* Specialized Quotas Telemetry Strip */}
                    <div className="space-y-1.5 p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] mb-4">
                      <div className="text-[10px] uppercase font-bold text-slate-400 pb-1 border-b border-white/10 flex justify-between">
                        <span>SPECIALIZED TELEMETRY</span>
                        <span>QUOTA</span>
                      </div>
                      
                      <div className="flex justify-between text-slate-300 gap-2">
                        <span className="truncate text-slate-400">{persona.labels.workout}:</span>
                        <strong className="text-white shrink-0">{persona.quotas.workout}m</strong>
                      </div>
                      <div className="flex justify-between text-slate-300 gap-2">
                        <span className="truncate text-slate-400">{persona.labels.study}:</span>
                        <strong className="text-white shrink-0">{persona.quotas.study}m</strong>
                      </div>
                      <div className="flex justify-between text-slate-300 gap-2">
                        <span className="truncate text-slate-400">{persona.labels.reading}:</span>
                        <strong className="text-white shrink-0">{persona.quotas.reading}p</strong>
                      </div>
                      <div className="flex justify-between text-slate-300 gap-2">
                        <span className="truncate text-slate-400">{persona.labels.screentime}:</span>
                        <strong className="text-red-400 shrink-0">{persona.quotas.maxScreen}m cap</strong>
                      </div>
                    </div>

                    {/* Feedback Quote Preview */}
                    <div className="text-xs italic text-slate-400 pl-2.5 border-l-2 border-white/20 mb-5">
                      "{persona.feedbackQuote}"
                    </div>
                  </div>

                  {/* Card Initiation Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInitiateProtocol(pId);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    style={{
                      backgroundColor: isSelected ? persona.accentColor : 'rgba(255, 255, 255, 0.1)',
                      color: isSelected ? (pId === 'RONALDO' || pId === 'STARK' ? '#000000' : '#ffffff') : '#ffffff',
                      border: `1px solid ${isSelected ? persona.accentColor : 'rgba(255, 255, 255, 0.15)'}`,
                    }}
                  >
                    <span>INITIATE PROTOCOL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Gateway Footer */}
          <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400 gap-3 shrink-0">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>SYSTEM STATUS: STANDBY // CLOUD PERSISTENCE ACTIVE</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setGatewayModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors font-mono cursor-pointer"
              >
                Cancel / Return
              </button>
              <button
                onClick={() => handleInitiateProtocol(previewPersonaId)}
                className="px-5 py-2 rounded-xl font-mono font-bold text-black bg-white hover:bg-slate-200 transition-colors uppercase flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Confirm {PERSONAS[previewPersonaId].name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. TACONIC DISCIPLINE OS // MAIN TACTICAL HUD MODAL & DRAWER  */}
      {/* ------------------------------------------------------------- */}
      {hudModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setHudModalOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl max-h-[96vh] flex flex-col rounded-2xl bg-[#090C10] border text-slate-200 shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              borderColor: activePersona.accentColor,
              boxShadow: `0 0 50px -10px ${activePersona.glowColor}`,
              fontFamily: "'Inter', sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Identity, Persona Status & Switch Operator Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-[#06080B] gap-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center border font-mono font-bold text-sm"
                  style={{
                    backgroundColor: `${activePersona.accentColor}15`,
                    borderColor: `${activePersona.accentColor}50`,
                    color: activePersona.accentColor,
                  }}
                >
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-mono">
                      TACONIC DISCIPLINE OS // TACTICAL HUD
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold uppercase bg-white/10 text-white/90">
                      OPERATOR: {activePersona.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    5-Pillar Specialized Telemetry & Cloud Synchronization
                  </p>
                </div>
              </div>

              {/* Action Controls, Auth, & Score */}
              <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center">
                
                {/* Firebase Auth User Profile Badge & Sign Out */}
                {currentUser && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]"
                      style={{
                        backgroundColor: `${activePersona.accentColor}25`,
                        color: activePersona.accentColor,
                        border: `1px solid ${activePersona.accentColor}40`,
                      }}
                    >
                      {currentUser.isAnonymous ? 'G' : (currentUser.displayName ? currentUser.displayName[0] : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U'))}
                    </div>
                    <span className="hidden md:inline max-w-[130px] truncate text-[11px]">
                      {currentUser.isAnonymous ? 'GUEST PROTOCOL' : (currentUser.displayName || currentUser.email)}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-slate-400 hover:text-red-400 transition-colors ml-1 cursor-pointer flex items-center gap-1"
                      title="Sign Out to Login Gateway"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px]">SIGN OUT</span>
                    </button>
                  </div>
                )}

                {/* Cloud Sync Status Indicator */}
                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono">
                  {syncState === 'saving' ? (
                    <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                  ) : syncState === 'synced' ? (
                    <Cloud className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <CloudOff className="w-3 h-3 text-slate-500" />
                  )}
                  <span className="text-slate-400 hidden lg:inline">
                    {syncState === 'saving' ? 'Syncing...' : syncState === 'synced' ? 'Cloud Synced' : 'Offline'}
                  </span>
                </div>

                {/* Switch Operator Button */}
                <button
                  onClick={() => {
                    setPreviewPersonaId(activePersonaId);
                    setHudModalOpen(false);
                    setGatewayModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-white text-xs font-mono font-semibold uppercase transition-all cursor-pointer shadow-sm"
                  title="Return to Operator Initialization Gateway"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Switch</span>
                </button>

                {/* Live Composite Execution Score */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      SCORE
                    </div>
                    <div className="text-base sm:text-lg font-black font-mono tracking-tight text-white flex items-center justify-end gap-1">
                      <span style={{ color: activePersona.accentColor }}>{executionScore}</span>
                      <span className="text-xs text-slate-400 font-normal">/100</span>
                    </div>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black font-mono"
                    style={{
                      backgroundColor: `${activePersona.accentColor}20`,
                      color: activePersona.accentColor,
                      border: `1px solid ${activePersona.accentColor}50`,
                    }}
                  >
                    {executionScore >= 90 ? 'S' : executionScore >= 80 ? 'A' : executionScore >= 70 ? 'B' : executionScore >= 50 ? 'C' : 'F'}
                  </div>
                </div>

                <button
                  onClick={() => setHudModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close HUD"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Persona Reactive Voice Banner */}
            <div 
              className="px-5 sm:px-6 py-2.5 border-b border-white/10 flex items-start sm:items-center gap-3 transition-colors duration-300"
              style={{
                backgroundColor: `${activePersona.accentColor}0a`,
                borderLeft: `4px solid ${activePersona.accentColor}`,
              }}
            >
              <div 
                className="w-2 h-2 rounded-full mt-1.5 sm:mt-0 shrink-0"
                style={{ backgroundColor: activePersona.accentColor }}
              />
              <div className="flex-1 text-xs">
                <span className="font-mono font-bold uppercase mr-2" style={{ color: activePersona.accentColor }}>
                  {activePersona.quoteAttribution}:
                </span>
                <span className="text-white font-medium italic">
                  "{activePersona.feedbackQuote}"
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Screen drag: {activePersona.frictionMultiplier}x multiplier</span>
              </div>
            </div>

            {/* Navigation Tabs inside HUD */}
            <div className="flex items-center gap-2 px-5 sm:px-6 py-2 border-b border-white/10 bg-[#080B0F] text-xs font-medium overflow-x-auto">
              <button
                onClick={() => setHudTab('hud')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  hudTab === 'hud'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                1. 5 Pillars Specialized Telemetry
              </button>

              <button
                onClick={() => setHudTab('alternatePath')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  hudTab === 'alternatePath'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                2. Alternate Path & Simulator
              </button>

              <button
                onClick={() => setHudTab('logger')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  hudTab === 'logger'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                3. Action Logger ({actionLogs.length})
              </button>

              <button
                onClick={() => setHudTab('projection')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  hudTab === 'projection'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" style={{ color: activePersona.accentColor }} />
                4. Trajectory Graph & Archetype Projection
              </button>
            </div>

            {/* Main Interactive Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-slate-300">
              
              {/* TAB 1: 5 PILLARS SPECIALIZED PROGRESS GRID (WITH FRAMER MOTION ANIMATION) */}
              {hudTab === 'hud' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                        <span>THE 5 PILLARS // {activePersona.name.toUpperCase()} SPECIALIZED GAUGES</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Zero-state initialization active. Quotas: {activePersona.signatureRequirement}. All updates sync live to Firebase Firestore.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                      <button
                        onClick={() => setHudTab('projection')}
                        className="px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer font-semibold shadow-sm"
                        style={{
                          backgroundColor: `${activePersona.accentColor}18`,
                          borderColor: `${activePersona.accentColor}40`,
                          color: activePersona.accentColor,
                        }}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Trajectory Projection Graph</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-slate-500">|</span>
                      <span className="text-emerald-400">Firestore: Live</span>
                    </div>
                  </div>

                  {/* 5 Pillars Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    
                    {/* Pillar 1: Specialized Workout */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-white truncate max-w-[210px]">
                            <Dumbbell className="w-4 h-4 text-emerald-400 shrink-0" />
                            {activePersona.labels.workout}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 font-semibold shrink-0">
                            {targetWorkout > 0 ? Math.round((workoutMinutes / targetWorkout) * 100) : 0}%
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-2 font-mono">
                          <span className="text-2xl font-black text-white">{workoutMinutes}</span>
                          <span className="text-xs text-slate-400">/ {targetWorkout} min quota</span>
                        </div>

                        {/* Framer Motion Animated Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden mb-3 relative border border-white/5">
                          <motion.div 
                            className="h-full bg-emerald-500 rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, targetWorkout > 0 ? (workoutMinutes / targetWorkout) * 100 : 0)}%` }}
                            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                          >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#10b981]" />
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => setWorkoutMinutes((prev) => Math.max(0, prev - 15))}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          -15m
                        </button>
                        <button
                          onClick={() => setWorkoutMinutes((prev) => prev + 15)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          +15m
                        </button>
                        <button
                          onClick={() => setWorkoutMinutes((prev) => prev + 30)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-emerald-300 font-semibold cursor-pointer ml-auto"
                        >
                          +30m Boost
                        </button>
                      </div>
                    </div>

                    {/* Pillar 2: Specialized Study */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-white truncate max-w-[210px]">
                            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                            {activePersona.labels.study}
                          </span>
                          <span className="text-[11px] font-mono text-cyan-400 font-semibold shrink-0">
                            {targetStudy > 0 ? Math.round((studyMinutes / targetStudy) * 100) : 0}%
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-2 font-mono">
                          <span className="text-2xl font-black text-white">{studyMinutes}</span>
                          <span className="text-xs text-slate-400">/ {targetStudy} min quota</span>
                        </div>

                        {/* Framer Motion Animated Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden mb-3 relative border border-white/5">
                          <motion.div 
                            className="h-full bg-cyan-500 rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, targetStudy > 0 ? (studyMinutes / targetStudy) * 100 : 0)}%` }}
                            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                          >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#06b6d4]" />
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => setStudyMinutes((prev) => Math.max(0, prev - 30))}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          -30m
                        </button>
                        <button
                          onClick={() => setStudyMinutes((prev) => prev + 30)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          +30m
                        </button>
                        <button
                          onClick={() => setStudyMinutes((prev) => prev + 60)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-cyan-300 font-semibold cursor-pointer ml-auto"
                        >
                          +1h Focus
                        </button>
                      </div>
                    </div>

                    {/* Pillar 3: Specialized Reading */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-white truncate max-w-[210px]">
                            <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                            {activePersona.labels.reading}
                          </span>
                          <span className="text-[11px] font-mono text-purple-400 font-semibold shrink-0">
                            {targetReading > 0 ? Math.round((readingPages / targetReading) * 100) : 0}%
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-2 font-mono">
                          <span className="text-2xl font-black text-white">{readingPages}</span>
                          <span className="text-xs text-slate-400">/ {targetReading} pages quota</span>
                        </div>

                        {/* Framer Motion Animated Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden mb-3 relative border border-white/5">
                          <motion.div 
                            className="h-full bg-purple-500 rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, targetReading > 0 ? (readingPages / targetReading) * 100 : 0)}%` }}
                            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                          >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#a855f7]" />
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => setReadingPages((prev) => Math.max(0, prev - 5))}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          -5p
                        </button>
                        <button
                          onClick={() => setReadingPages((prev) => prev + 5)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          +5p
                        </button>
                        <button
                          onClick={() => setReadingPages((prev) => prev + 15)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-purple-300 font-semibold cursor-pointer ml-auto"
                        >
                          +15p Chapter
                        </button>
                      </div>
                    </div>

                    {/* Pillar 4: Specialized Screen Time (Friction metric) */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-white truncate max-w-[210px]">
                            <Smartphone className="w-4 h-4 text-red-400 shrink-0" />
                            {activePersona.labels.screentime}
                          </span>
                          <span className={`text-[11px] font-mono font-semibold shrink-0 ${screenMinutes > maxScreenTime ? 'text-red-400' : 'text-emerald-400'}`}>
                            {screenMinutes > maxScreenTime ? `+${screenMinutes - maxScreenTime}m OVER CAP` : 'Within Limit'}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-2 font-mono">
                          <span className="text-2xl font-black text-white">{screenMinutes}</span>
                          <span className="text-xs text-slate-400">/ {maxScreenTime} min max limit</span>
                        </div>

                        {/* Framer Motion Animated Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden mb-3 relative border border-white/5">
                          <motion.div 
                            className={`h-full rounded-full relative ${screenMinutes > maxScreenTime ? 'bg-red-500' : 'bg-emerald-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (screenMinutes / (maxScreenTime * 1.5)) * 100)}%` }}
                            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                          >
                            <div className={`absolute right-0 top-0 bottom-0 w-1 bg-white ${screenMinutes > maxScreenTime ? 'shadow-[0_0_8px_#ef4444]' : 'shadow-[0_0_8px_#10b981]'}`} />
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => setScreenMinutes((prev) => Math.max(0, prev - 30))}
                          className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 text-xs font-mono cursor-pointer"
                        >
                          -30m Reclaim
                        </button>
                        <button
                          onClick={() => setScreenMinutes((prev) => prev + 15)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 cursor-pointer ml-auto"
                        >
                          +15m
                        </button>
                        <button
                          onClick={() => setScreenMinutes((prev) => prev + 30)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-xs font-mono text-red-300 cursor-pointer"
                        >
                          +30m Leak
                        </button>
                      </div>
                    </div>

                    {/* Pillar 5: Custom Tactical Objective (Replacing Macro Horizon with Archetype Affinity Mechanism) */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between sm:col-span-2 lg:col-span-2">
                      {!customTask.isConfigured ? (
                        <div className="py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="space-y-1 text-center sm:text-left">
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                              <Target className="w-4 h-4 text-amber-400" />
                              <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                                Pillar 05: Custom Tactical Objective
                              </span>
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                                BLANK // UNASSIGNED
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 max-w-md">
                              Replace macro horizon with your personal discipline protocol. Choose from baseline templates (Cold Plunge, Meditation, Coding, Combat, Fasting, Sleep, Debrief) or name your own custom task.
                            </p>
                          </div>

                          <button
                            onClick={() => setCustomPillarModalOpen(true)}
                            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-mono font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-lg shrink-0 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Configure Custom Pillar</span>
                          </button>
                        </div>
                      ) : (() => {
                        const template = PRELOADED_ACTIVITIES.find((a) => a.id === customTask.templateId) || PRELOADED_ACTIVITIES[0];
                        const affinity = template.affinities[activePersonaId];
                        const progressPct = Math.min(100, Math.round((customTask.current / (customTask.target || 1)) * 100));

                        return (
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="text-xs font-mono font-bold uppercase text-white truncate max-w-[220px]">
                                  Pillar 05: {customTask.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                                  ({template.title})
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  affinity.reaction === 'synergy'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : affinity.reaction === 'deplete'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                }`}>
                                  {affinity.reaction === 'synergy' ? `🔥 SYNERGY BOOST (+${affinity.boost}%)` :
                                   affinity.reaction === 'deplete' ? `⚠️ FRICTION (${affinity.boost}%)` :
                                   `⭐ UNIVERSAL DISCIPLINE (+${affinity.boost}%)`}
                                </span>
                                <button
                                  onClick={() => setCustomPillarModalOpen(true)}
                                  className="text-[11px] font-mono text-slate-400 hover:text-white underline cursor-pointer"
                                >
                                  Edit Task
                                </button>
                              </div>
                            </div>

                            <div className="flex items-baseline gap-2 mb-2 font-mono">
                              <span className="text-2xl font-black text-white">{customTask.current}</span>
                              <span className="text-xs text-slate-400">/ {customTask.target} {customTask.unit} ({progressPct}%)</span>
                            </div>

                            {/* Framer Motion Animated Progress Bar */}
                            <div className="w-full h-2.5 rounded-full bg-black/60 overflow-hidden mb-2 relative border border-white/5">
                              <motion.div 
                                className={`h-full rounded-full relative ${
                                  affinity.reaction === 'deplete' ? 'bg-amber-500' : 'bg-gradient-to-r from-amber-400 to-emerald-400'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                              >
                                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_#f59e0b]" />
                              </motion.div>
                            </div>

                            {/* Archetype Spoken Voice Reaction */}
                            <p className="text-xs italic text-slate-300 mb-3 pl-2.5 border-l-2" style={{ borderColor: activePersona.accentColor }}>
                              "{affinity.remark}"
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                              <span className="text-slate-400">
                                {affinity.verdict}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setCustomTask((prev) => ({ ...prev, current: Math.max(0, prev.current - 1) }))}
                                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer"
                                >
                                  -1 {customTask.unit}
                                </button>
                                <button
                                  onClick={() => setCustomTask((prev) => ({ ...prev, current: Math.min(prev.target, prev.current + 1) }))}
                                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer"
                                >
                                  +1 {customTask.unit}
                                </button>
                                <button
                                  onClick={() => setCustomTask((prev) => ({ ...prev, current: prev.target }))}
                                  className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-semibold cursor-pointer ml-1"
                                >
                                  100% Complete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                  </div>

                  {/* Tactical Operator Directive Box */}
                  <div 
                    className="p-4 rounded-xl border flex items-start gap-4"
                    style={{
                      backgroundColor: `${activePersona.accentColor}08`,
                      borderColor: `${activePersona.accentColor}40`,
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${activePersona.accentColor}18`,
                        borderColor: `${activePersona.accentColor}50`,
                        color: activePersona.accentColor,
                      }}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span>OPERATOR TACTICAL DIRECTIVE</span>
                        <span>·</span>
                        <span style={{ color: activePersona.accentColor }}>{activePersona.alias}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activePersona.tacticalDirective}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ALTERNATE PATH & PROJECTION SIMULATOR */}
              {hudTab === 'alternatePath' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" style={{ color: activePersona.accentColor }} />
                      <span>THE "ALTERNATE PATH" BOTTLENECK SIMULATOR</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Drag the slider to test what happens if you eliminate screen time leaks and reallocate that cognitive bandwidth over the next 30 days.
                    </p>
                  </div>

                  {/* Simulator Control Board */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-mono uppercase text-white font-semibold flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-red-400" />
                          Screen Time To Reclaim Daily:
                        </label>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          -{reclaimScreenSlider} Minutes / Day
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="120"
                        step="15"
                        value={reclaimScreenSlider}
                        onChange={(e) => setReclaimScreenSlider(Number(e.target.value))}
                        className="w-full h-2 rounded-lg bg-black/60 accent-emerald-500 cursor-pointer"
                      />

                      <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                        <span>0m (Baseline)</span>
                        <span>30m</span>
                        <span>60m (Recommended)</span>
                        <span>90m</span>
                        <span>120m (Aggressive Purge)</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-white font-semibold block mb-2">
                        Reallocate Reclaimed Bandwidth Into:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setReallocateTarget('study')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            reallocateTarget === 'study'
                              ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                              : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <div className="text-xs font-bold font-mono uppercase">Deep Study (+80% Efficiency)</div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            Channels reclaimed time into {activePersona.labels.study}.
                          </div>
                        </button>

                        <button
                          onClick={() => setReallocateTarget('workout')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            reallocateTarget === 'workout'
                              ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200'
                              : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <div className="text-xs font-bold font-mono uppercase">Physical Armor (+70% Output)</div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            Channels reclaimed time into {activePersona.labels.workout}.
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 30-Day Projections Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">
                        Hours Reclaimed (30 Days)
                      </div>
                      <div className="text-2xl font-black font-mono text-emerald-400">
                        +{alternateProjections.hoursReclaimed30Days} hrs
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Pure lost time salvaged from digital friction.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">
                        Execution Score Shift
                      </div>
                      <div className="text-2xl font-black font-mono text-amber-400 flex items-center gap-2">
                        <span>{executionScore}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="text-emerald-400">{alternateProjections.projectedScore}</span>
                        <span className="text-xs text-emerald-400 font-normal">
                          (+{alternateProjections.scoreDelta})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        New projected daily discipline grade over a 30-day rolling EWMA.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">
                        Macro Target Timeline
                      </div>
                      <div className="text-2xl font-black font-mono text-cyan-400">
                        {alternateProjections.daysAhead > 0 ? `+${alternateProjections.daysAhead} Days Ahead` : 'On Target'}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Estimated acceleration toward completing the 90-day macro benchmark.
                      </p>
                    </div>
                  </div>

                  {/* Persona Verdict on this Alternate Path */}
                  <div 
                    className="p-4 rounded-xl border text-xs space-y-2"
                    style={{
                      backgroundColor: `${activePersona.accentColor}0a`,
                      borderColor: `${activePersona.accentColor}40`,
                    }}
                  >
                    <div className="font-mono font-bold uppercase tracking-wider text-white flex items-center justify-between">
                      <span style={{ color: activePersona.accentColor }}>
                        OPERATOR SIMULATION VERDICT // {activePersona.name}
                      </span>
                      <span className="text-slate-400">Confidence: 94.2%</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {activePersonaId === 'VADER' && `Purging ${reclaimScreenSlider} minutes removes your fatal weakness. The distraction is excised. Execute without remorse.`}
                      {activePersonaId === 'RONALDO' && `Reallocating ${reclaimScreenSlider} minutes gives us +${alternateProjections.hoursReclaimed30Days} hours this month. This is how champions separate from the pack. Let's work!`}
                      {activePersonaId === 'STARK' && `Thermal scan shows bandwidth restored. Converting idle screen cycles back into study delivers a +${alternateProjections.scoreDelta} point system upgrade.`}
                      {activePersonaId === 'BATMAN' && `The dark hours yield +${alternateProjections.hoursReclaimed30Days} hours of silent preparation. Gotham doesn't witness your training; it witnesses the result.`}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: DAILY ACTION LOGGER */}
              {hudTab === 'logger' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                      <Plus className="w-5 h-5 text-emerald-400" />
                      <span>DAILY ACTION LOGGER // SPECIALIZED LOGS</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Log a completed action in real-time. Entries immediately update metrics and persist automatically to Cloud Firestore.
                    </p>
                  </div>

                  {/* Interactive Quick Add Form */}
                  <form onSubmit={handleAddLog} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                          Specialized Pillar Category
                        </label>
                        <select
                          value={newLogCategory}
                          onChange={(e) => setNewLogCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-white/40 cursor-pointer"
                        >
                          <option value="workout">{activePersona.labels.workout} (Minutes)</option>
                          <option value="study">{activePersona.labels.study} (Minutes)</option>
                          <option value="reading">{activePersona.labels.reading} (Pages)</option>
                          <option value="screentime">{activePersona.labels.screentime} (Minutes)</option>
                          {customTask.isConfigured && (
                            <option value="custom">Pillar 05: {customTask.name} ({customTask.unit})</option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                          Activity Title / Directive Notes
                        </label>
                        <input
                          type="text"
                          value={newLogTitle}
                          onChange={(e) => setNewLogTitle(e.target.value)}
                          placeholder={`e.g. ${activePersona.labels.workout} Stage 1`}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-white/40"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                          Amount ({newLogCategory === 'reading' ? 'Pages' : newLogCategory === 'custom' ? customTask.unit : 'Minutes'})
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="1"
                            value={newLogAmount}
                            onChange={(e) => setNewLogAmount(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-white/40"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase text-black bg-white hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Add Log
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Activity History Feed */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center justify-between">
                      <span>TODAY'S EXECUTION FEED ({actionLogs.length} EVENTS)</span>
                      <span className="text-[11px] text-slate-500">Persisted in Firestore</span>
                    </div>

                    {actionLogs.length === 0 ? (
                      <div className="p-8 rounded-xl border border-dashed border-white/15 text-center text-xs text-slate-500 font-mono">
                        No activity logged yet today. Use the form above or quick adjust buttons to initiate telemetry.
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                        {actionLogs.map((log) => (
                          <div key={log.id} className="p-3 flex items-center justify-between text-xs hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                log.category === 'workout' ? 'bg-emerald-400' :
                                log.category === 'study' ? 'bg-cyan-400' :
                                log.category === 'reading' ? 'bg-purple-400' : 
                                log.category === 'custom' ? 'bg-amber-400' : 'bg-red-400'
                              }`} />
                              <div>
                                <div className="font-semibold text-white">{log.title}</div>
                                <div className="text-[10px] text-slate-400 font-mono capitalize">
                                  {log.category === 'workout' ? activePersona.labels.workout :
                                   log.category === 'study' ? activePersona.labels.study :
                                   log.category === 'reading' ? activePersona.labels.reading :
                                   log.category === 'screentime' ? activePersona.labels.screentime :
                                   (customTask.isConfigured ? customTask.name : 'Custom Objective')} · {log.time}
                                </div>
                              </div>
                            </div>

                            <div className="font-mono font-bold text-white">
                              +{log.value} {log.category === 'reading' ? 'pages' : log.category === 'custom' ? customTask.unit : 'min'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: TRAJECTORY GRAPH & ARCHETYPE PROJECTION */}
              {hudTab === 'projection' && (
                <TrajectoryGraphProjection
                  workoutMinutes={workoutMinutes}
                  studyMinutes={studyMinutes}
                  readingPages={readingPages}
                  screenMinutes={screenMinutes}
                  macroProgress={macroProgress}
                  executionScore={executionScore}
                  activePersona={activePersona}
                  targetWorkout={targetWorkout}
                  targetStudy={targetStudy}
                  targetReading={targetReading}
                  maxScreenTime={maxScreenTime}
                  actionLogsCount={actionLogs.length}
                  customTask={customTask}
                  onQuickLog={(category, amount) => {
                    if (category === 'custom' && customTask.isConfigured) {
                      setCustomTask((prev) => ({
                        ...prev,
                        current: Math.min(prev.target, prev.current + amount),
                      }));
                      return;
                    }
                    const newEntry: LogEntry = {
                      id: Date.now().toString(),
                      category: category as any,
                      title: `Trajectory ${category} boost`,
                      value: amount,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    setActionLogs((prev) => [newEntry, ...prev]);
                    if (category === 'workout') setWorkoutMinutes((prev) => prev + amount);
                    if (category === 'study') setStudyMinutes((prev) => prev + amount);
                    if (category === 'reading') setReadingPages((prev) => prev + amount);
                    if (category === 'screentime') setScreenMinutes((prev) => prev + amount);
                  }}
                />
              )}

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-white/10 bg-[#06080B] text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>OPERATOR LOCKED: {activePersona.name} ({activePersona.signatureRequirement})</span>
              </div>
              <button
                onClick={() => setHudModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
              >
                Close HUD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Custom Pillar 05 Configuration Modal */}
      <CustomPillarModal
        isOpen={customPillarModalOpen}
        onClose={() => setCustomPillarModalOpen(false)}
        activePersonaId={activePersonaId}
        currentTask={customTask}
        onSaveTask={(task) => setCustomTask(task)}
      />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
