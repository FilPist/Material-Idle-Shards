import React, { useState } from 'react';
import { useGameHook } from '../hooks/useGame';
import { Skill } from '../types';
import { BoltIcon, ShardIcon, GoldenTouchIcon, TimeWarpIcon, AutomationIcon } from './icons';

const getIconForSkill = (id: string): React.ComponentType<{ className?: string }> => {
    switch (id) {
        case 'skill_frenzied_clicks': return BoltIcon;
        case 'skill_critical_surge': return BoltIcon;
        case 'skill_gen_overdrive': return AutomationIcon;
        case 'skill_shard_storm': return ShardIcon;
        case 'skill_golden_touch': return GoldenTouchIcon;
        case 'skill_time_warp': return TimeWarpIcon;
        default: return BoltIcon;
    }
};

const SkillShortcut: React.FC<{ skill: Skill; onActivate: (id: string) => void; t: (key: string) => string }> = ({ skill, onActivate, t }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const isReady = !skill.isActive && (skill.cooldownRemaining ?? 0) <= 0;
    const cooldownPercent = skill.cooldown ? 100 - (((skill.cooldownRemaining ?? 0) / skill.cooldown) * 100) : 100;

    const Icon = getIconForSkill(skill.id);

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
        >
            <button
                onClick={() => onActivate(skill.id)}
                disabled={!isReady}
                className="relative w-14 h-14 rounded-full bg-white/50 dark:bg-slate-800/40 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-all duration-150 transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-md hover:shadow-lg"
                aria-label={t(skill.nameKey)}
            >
                {/* Cooldown/Active Overlay */}
                {!isReady && (
                    <div 
                        className="absolute inset-0 rounded-full bg-black/70"
                        style={{ background: `conic-gradient(rgba(30,27,75,0.7) ${cooldownPercent}%, transparent ${cooldownPercent}%)`}}
                    />
                )}
                 {skill.isActive && (
                    <div className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-slate-800/20 ring-teal-400 animate-pulse" />
                )}

                <Icon className="w-8 h-8 z-10" />

                {/* Cooldown/Active text */}
                {!isReady && (
                    <span className="absolute text-white font-bold text-lg drop-shadow-md z-10 pointer-events-none">
                        {skill.isActive ? skill.durationRemaining?.toFixed(0) : skill.cooldownRemaining?.toFixed(0)}
                    </span>
                )}
            </button>
            {isTooltipVisible && (
                <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-2xl z-50 text-center whitespace-pre-line pointer-events-none">
                    <span className="font-bold text-base">{t(skill.nameKey)}</span>
                    <p className="opacity-80 mt-1">{t(skill.descriptionKey)}</p>
                </div>
            )}
        </div>
    );
};

export const ActiveSkillsBar: React.FC<{ game: useGameHook, t: (key: string) => string }> = ({ game, t }) => {
    const activeSkills = game.skills.filter(s => s.type === 'ACTIVE' && s.level > 0);

    if (activeSkills.length === 0) {
        return null;
    }

    return (
        <div className="absolute bottom-[150px] md:bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 p-2 bg-slate-100/30 dark:bg-slate-900/30 backdrop-blur-md rounded-full shadow-lg z-20 no-omniclick">
            {activeSkills.map(skill => (
                <SkillShortcut key={skill.id} skill={skill} onActivate={game.handleActivateSkill} t={t} />
            ))}
        </div>
    );
};