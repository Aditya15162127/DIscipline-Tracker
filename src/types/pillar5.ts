/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PersonaId } from '../App.tsx';

export interface ArchetypeAffinity {
  boost: number; // Percentage point adjustment (e.g. +25 or -15)
  reaction: 'synergy' | 'deplete' | 'universal';
  verdict: string;
  remark: string;
}

export interface ActivityTemplate {
  id: string;
  title: string;
  category: 'physical' | 'mental' | 'engineering' | 'combat' | 'universal' | 'biological';
  defaultUnit: string;
  defaultTarget: number;
  description: string;
  affinities: Record<PersonaId, ArchetypeAffinity>;
}

export interface CustomTaskPillar {
  name: string;
  templateId: string;
  target: number;
  current: number;
  unit: string;
  isConfigured: boolean;
}

export const PRELOADED_ACTIVITIES: ActivityTemplate[] = [
  {
    id: 'cold_plunge',
    title: 'Cold Plunge & Cryo Recovery',
    category: 'physical',
    defaultUnit: 'min',
    defaultTarget: 10,
    description: 'Ice bath immersion or cold shower to accelerate systemic recovery and mental toughness.',
    affinities: {
      RONALDO: {
        boost: 25,
        reaction: 'synergy',
        verdict: 'ELITE RECOVERY VERIFIED',
        remark: 'SIUUU! Champions embrace the ice. Extreme recovery separates the best from the rest!',
      },
      BATMAN: {
        boost: 15,
        reaction: 'synergy',
        verdict: 'MENTAL FORTITUDE APPROVED',
        remark: 'The freeze tempers physical pain and sharpens survival instinct.',
      },
      VADER: {
        boost: 10,
        reaction: 'synergy',
        verdict: 'PHYSICAL ENDURANCE ACCEPTED',
        remark: 'Endure the frost. Physical suffering fortifies dark resolve.',
      },
      STARK: {
        boost: -10,
        reaction: 'deplete',
        verdict: 'INEFFICIENT THERMODYNAMICS',
        remark: 'Shivering in freezing water is medieval. A heated titanium compression suit is 10x more efficient.',
      },
    },
  },
  {
    id: 'meditation',
    title: 'Silent Meditation & Solitude',
    category: 'mental',
    defaultUnit: 'min',
    defaultTarget: 20,
    description: 'Uncompromising sensory silence, breathwork, and stoic mental fortification.',
    affinities: {
      VADER: {
        boost: 30,
        reaction: 'synergy',
        verdict: 'DARK CONCENTRATION MAXIMIZED',
        remark: 'Absolute silence feeds the Force. In darkness, your true power awakens.',
      },
      BATMAN: {
        boost: 20,
        reaction: 'synergy',
        verdict: 'TACTICAL AWARENESS LOCKED',
        remark: 'Clearing the noise is how you anticipate threats before they manifest.',
      },
      STARK: {
        boost: -10,
        reaction: 'deplete',
        verdict: 'IDLE PROCESSOR CYCLES',
        remark: 'Sitting motionless staring at a blank wall? That is prime computational bandwidth going to waste.',
      },
      RONALDO: {
        boost: -15,
        reaction: 'deplete',
        verdict: 'ZERO VOLUME DEFICIENCY',
        remark: 'Sitting still burns zero calories and scores zero goals! Move your body, do 100 pushups instead!',
      },
    },
  },
  {
    id: 'coding_hardware',
    title: 'Hardware & Code Engineering',
    category: 'engineering',
    defaultUnit: 'min',
    defaultTarget: 60,
    description: 'Deep technical prototyping, building systems, or complex software development.',
    affinities: {
      STARK: {
        boost: 30,
        reaction: 'synergy',
        verdict: 'ARC CORE PROTOCOL ALIGNED',
        remark: 'Now that is what I call high-bandwidth output! Let us engineer weapons and software.',
      },
      BATMAN: {
        boost: -10,
        reaction: 'deplete',
        verdict: 'DIGITAL TRACE HAZARD',
        remark: 'Excessive terminal glow leaves digital telemetry footprints. Keep the hardware dark.',
      },
      VADER: {
        boost: -15,
        reaction: 'deplete',
        verdict: 'INSIGNIFICANT TECHNOLOGY',
        remark: 'The ability to construct machines is insignificant next to the supremacy of the Force.',
      },
      RONALDO: {
        boost: -10,
        reaction: 'deplete',
        verdict: 'SEDENTARY FRICTION',
        remark: 'Sitting in front of a keyboard weakens athletic conditioning. Keep workouts priority.',
      },
    },
  },
  {
    id: 'combat_sparring',
    title: 'Combat Sparring & Martial Drills',
    category: 'combat',
    defaultUnit: 'rounds',
    defaultTarget: 5,
    description: 'Boxing, Brazilian Jiu-Jitsu, Muay Thai, or tactical self-defense sparring.',
    affinities: {
      BATMAN: {
        boost: 25,
        reaction: 'synergy',
        verdict: 'LEAGUE COMBAT STANDARD',
        remark: 'The streets of Gotham forgive nothing. Reflexes must be honed in real combat.',
      },
      VADER: {
        boost: 20,
        reaction: 'synergy',
        verdict: 'LETHAL AGGRESSION CHANNELED',
        remark: 'Strike without mercy. Aggression disciplined into martial mastery pleases the Emperor.',
      },
      RONALDO: {
        boost: 10,
        reaction: 'synergy',
        verdict: 'EXPLOSIVE AGILITY GAIN',
        remark: 'Great for footwork, core rotation, and explosive cardiovascular stamina!',
      },
      STARK: {
        boost: -10,
        reaction: 'deplete',
        verdict: 'PRIMITIVE KINETICS',
        remark: 'Bruising your knuckles when you could automate repulsor gauntlets is a design flaw.',
      },
    },
  },
  {
    id: 'fasting',
    title: 'Fasting & Metabolic Discipline (Universal)',
    category: 'universal',
    defaultUnit: 'hours',
    defaultTarget: 16,
    description: 'Intermittent fasting and zero refined sugar to optimize cellular autophagy and focus.',
    affinities: {
      RONALDO: {
        boost: 15,
        reaction: 'universal',
        verdict: 'PEAK MACHINE PURITY',
        remark: 'Universal athletic standard! Clean nutrition keeps the body lean, fast, and unstoppable.',
      },
      VADER: {
        boost: 15,
        reaction: 'universal',
        verdict: 'MASTERY OVER APPETITE',
        remark: 'Denying physical hunger demonstrates mastery of the mind over weak biological cravings.',
      },
      BATMAN: {
        boost: 15,
        reaction: 'universal',
        verdict: 'HEIGHTENED SENSORY VIGILANCE',
        remark: 'Fasting sharpens adrenaline and eliminates cognitive sluggishness during watch.',
      },
      STARK: {
        boost: 15,
        reaction: 'universal',
        verdict: 'METABOLIC OPTIMIZATION',
        remark: 'Stable glucose levels prevent post-meal thermal crashes. Smart biochemical design.',
      },
    },
  },
  {
    id: 'sleep_protocol',
    title: '8-Hour Circadian Sleep Lock',
    category: 'biological',
    defaultUnit: 'hours',
    defaultTarget: 8,
    description: 'Strict nocturnal sleep schedule with zero blue light to maximize hormonal restoration.',
    affinities: {
      RONALDO: {
        boost: 20,
        reaction: 'synergy',
        verdict: 'CHAMPION HORMONAL RESTORATION',
        remark: 'Sleep is when muscles synthesize and growth hormone surges. Non-negotiable for champions!',
      },
      STARK: {
        boost: 10,
        reaction: 'synergy',
        verdict: 'BIOLOGICAL RECHARGE COMPLETE',
        remark: 'Even supercomputers need scheduled defragmentation and power cycling.',
      },
      BATMAN: {
        boost: -20,
        reaction: 'deplete',
        verdict: 'NOCTURNAL VIGIL NEGLECTED',
        remark: 'Gotham burns while you sleep 8 hours. The cowl demands sleepless nocturnal patrol.',
      },
      VADER: {
        boost: -15,
        reaction: 'deplete',
        verdict: 'VULNERABILITY DETECTED',
        remark: 'Extended slumber is a liability. A true master rests only when the galaxy is conquered.',
      },
    },
  },
  {
    id: 'tactical_debrief',
    title: 'Nocturnal Debrief & Case Review (Universal)',
    category: 'universal',
    defaultUnit: 'min',
    defaultTarget: 15,
    description: 'Timestamped evening log reviewing operational successes, failures, and tomorrow\'s targets.',
    affinities: {
      BATMAN: {
        boost: 20,
        reaction: 'universal',
        verdict: 'CASE FILE ACCURACY',
        remark: 'Universal detective protocol. Audit every misstep so yesterday\'s error is never repeated.',
      },
      STARK: {
        boost: 15,
        reaction: 'universal',
        verdict: 'TELEMETRY FLUSH',
        remark: 'Dump your operational logs to persistent memory before the cache wipes.',
      },
      VADER: {
        boost: 15,
        reaction: 'universal',
        verdict: 'RUTHLESS SELF-INQUISITION',
        remark: 'Examine your execution. Ruthlessly purge the habits that showed hesitation.',
      },
      RONALDO: {
        boost: 15,
        reaction: 'universal',
        verdict: 'TACTICAL FILM REVIEW',
        remark: 'Review the day like game film. Adjust your technique and come back hungrier!',
      },
    },
  },
];
