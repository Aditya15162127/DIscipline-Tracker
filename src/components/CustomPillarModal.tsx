/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  TrendingUp, 
  Shield, 
  Zap, 
  Cpu, 
  Target,
  ArrowRight,
  Plus
} from 'lucide-react';
import { PersonaId } from '../App.tsx';
import { PRELOADED_ACTIVITIES, ActivityTemplate, CustomTaskPillar } from '../types/pillar5.ts';

interface CustomPillarModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePersonaId: PersonaId;
  currentTask: CustomTaskPillar | null;
  onSaveTask: (task: CustomTaskPillar) => void;
}

export const CustomPillarModal: React.FC<CustomPillarModalProps> = ({
  isOpen,
  onClose,
  activePersonaId,
  currentTask,
  onSaveTask,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    currentTask?.templateId || PRELOADED_ACTIVITIES[0].id
  );
  const [customName, setCustomName] = useState<string>(
    currentTask?.name || PRELOADED_ACTIVITIES[0].title
  );
  const [customTarget, setCustomTarget] = useState<number>(
    currentTask?.target || PRELOADED_ACTIVITIES[0].defaultTarget
  );
  const [customUnit, setCustomUnit] = useState<string>(
    currentTask?.unit || PRELOADED_ACTIVITIES[0].defaultUnit
  );

  if (!isOpen) return null;

  const selectedTemplate = PRELOADED_ACTIVITIES.find((a) => a.id === selectedTemplateId) || PRELOADED_ACTIVITIES[0];
  const activeAffinity = selectedTemplate.affinities[activePersonaId];

  const handleSelectTemplate = (template: ActivityTemplate) => {
    setSelectedTemplateId(template.id);
    setCustomName(template.title);
    setCustomTarget(template.defaultTarget);
    setCustomUnit(template.defaultUnit);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onSaveTask({
      name: customName.trim(),
      templateId: selectedTemplateId,
      target: Math.max(1, customTarget),
      current: currentTask?.current || 0,
      unit: customUnit || 'min',
      isConfigured: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#090C12] border border-white/15 text-slate-200 shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#06080B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-mono">
                CONFIGURE PILLAR 05 // CUSTOM TACTICAL TASK
              </h2>
              <p className="text-xs text-slate-400">
                Replace macro horizon with a custom discipline protocol linked to archetype affinities.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
          
          {/* Step 1: Preloaded Activity Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono font-bold uppercase text-white tracking-wider flex items-center gap-2">
                <span>1. Select Baseline Activity Template</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Determines archetype preference & score impact
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto p-1">
              {PRELOADED_ACTIVITIES.map((act) => {
                const isSelected = act.id === selectedTemplateId;
                const affinity = act.affinities[activePersonaId];
                return (
                  <div
                    key={act.id}
                    onClick={() => handleSelectTemplate(act)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-white/10 border-white/40 shadow-lg'
                        : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white tracking-wide truncate">
                        {act.title}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        affinity.reaction === 'synergy'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : affinity.reaction === 'deplete'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {affinity.boost > 0 ? `+${affinity.boost}%` : `${affinity.boost}%`}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {act.description}
                    </p>

                    {/* Archetype Quick Reaction Tag */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 pt-1 border-t border-white/5">
                      <span>{affinity.verdict}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Archetype Synergy / Friction Feedback Box */}
          <div 
            className={`p-3.5 rounded-xl border font-mono space-y-1.5 transition-all ${
              activeAffinity.reaction === 'synergy'
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : activeAffinity.reaction === 'deplete'
                ? 'bg-red-950/30 border-red-500/40 text-red-300'
                : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5">
                {activeAffinity.reaction === 'synergy' && <Flame className="w-4 h-4 text-emerald-400" />}
                {activeAffinity.reaction === 'deplete' && <ShieldAlert className="w-4 h-4 text-red-400" />}
                {activeAffinity.reaction === 'universal' && <Sparkles className="w-4 h-4 text-cyan-400" />}
                <span>Active Archetype Impact: {activeAffinity.verdict}</span>
              </span>
              <span className="text-white text-xs">
                {activeAffinity.boost > 0 ? `+${activeAffinity.boost}% Score Boost` : `${activeAffinity.boost}% Friction Penalty`}
              </span>
            </div>
            <p className="text-xs italic text-slate-200">
              "{activeAffinity.remark}"
            </p>
          </div>

          {/* Step 2: Custom Name & Parameters */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <label className="font-mono font-bold uppercase text-white tracking-wider block">
              2. Customize Task Title & Quota
            </label>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Custom Name (e.g. "Morning Cryo Plunge", "Shadow Boxing", "Quantum Code Forge")
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter custom task name..."
                required
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Daily Target Quota
                </label>
                <input
                  type="number"
                  min="1"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(Math.max(1, Number(e.target.value)))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Measurement Unit
                </label>
                <input
                  type="text"
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  placeholder="e.g. min, pages, rounds, %"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-mono font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Lock Pillar 05 Custom Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
