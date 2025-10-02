import React, { useState } from 'react';
import { useGameHook } from '../hooks/useGame';
import { formatNumber } from '../utils/format';
import { ShardIcon, PrestigeIcon, SingularityIcon, CosmicDustIcon } from './icons';

interface StatsBarProps {
  game: useGameHook;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

interface StatPillProps {
  label: string;
  value: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  colorClass?: string;
  children?: React.ReactNode;
  tooltipContent?: React.ReactNode;
  showTooltip?: boolean;
}

const StatPill: React.FC<StatPillProps> = ({ label, value, onMouseEnter, onMouseLeave, colorClass = "text-slate-600 dark:text-slate-300", children, tooltipContent, showTooltip }) => (
    <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`relative flex items-baseline justify-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${colorClass}`}
    >
        {children}
        <span className="text-xs sm:text-sm md:text-base font-bold">{label}</span>
        <span className="text-sm sm:text-base md:text-lg font-black tracking-tight">{value}</span>
        {showTooltip && tooltipContent && (
            <div className="tooltip absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-xl shadow-2xl z-50 text-left border border-slate-200 dark:border-slate-700">
                {tooltipContent}
            </div>
        )}
    </div>
);


export const StatsBar: React.FC<StatsBarProps> = ({ game, t }) => {
    const { shards, shardsPerClick, totalSPS, critChance, critDamage, relics, singularityEssence, ascensionCount, currentShardTier, cosmicDust } = game;
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    const tooltips: { [key: string]: React.ReactNode } = {
        spc: (
            <div>
                <h4 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('modal.spc_title')}</h4>
                <p className="opacity-90">{t('modal.spc_desc')}</p>
            </div>
        ),
        crit: (
            <div>
                <h4 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('modal.crit_title')}</h4>
                <p className="opacity-90">{t('modal.crit_desc', { damage: critDamage.toFixed(2) })}</p>
            </div>
        ),
        sps: (
            <div>
                <h4 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('modal.sps_title')}</h4>
                <p className="opacity-90">{t('modal.sps_desc')}</p>
            </div>
        ),
        relics: (
            <div>
                <h4 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('modal.relics_title')}</h4>
                <p className="opacity-90">{t('modal.relics_desc')}</p>
            </div>
        ),
        dust: (
            <div>
                <h4 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('modal.dust_title')}</h4>
                <p className="opacity-90">{t('modal.dust_desc')}</p>
            </div>
        ),
        essence: (
            <div>
                <h4 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-100">{t('modal.essence_title')}</h4>
                <p className="opacity-90">{t('modal.essence_desc')}</p>
            </div>
        ),
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            {/* Shard Count */}
            <div className="md:col-span-1 bg-white dark:bg-slate-800 rounded-full shadow-lg px-4 py-2 flex items-center justify-center text-center md:justify-start md:text-left gap-4">
                <ShardIcon className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" />
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">{formatNumber(shards)}</h2>
                </div>
            </div>

            {/* Other Stats */}
            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl md:rounded-full shadow-lg p-2 flex items-center justify-center md:justify-between">
                <div className="px-4 font-bold text-slate-500 dark:text-slate-400 mr-auto hidden md:block">{t(currentShardTier.nameKey)}</div>
                <div className="w-full flex flex-wrap justify-center gap-1 md:w-auto md:justify-end">
                    <StatPill
                        label={t('stats.spc')}
                        value={formatNumber(shardsPerClick)}
                        onMouseEnter={() => setActiveTooltip('spc')}
                        onMouseLeave={() => setActiveTooltip(null)}
                        showTooltip={activeTooltip === 'spc'}
                        tooltipContent={tooltips.spc}
                    />
                    <StatPill
                        label={t('stats.crit')}
                        value={`${(critChance * 100).toFixed(0)}%`}
                        colorClass="text-red-600 dark:text-red-500"
                        onMouseEnter={() => setActiveTooltip('crit')}
                        onMouseLeave={() => setActiveTooltip(null)}
                        showTooltip={activeTooltip === 'crit'}
                        tooltipContent={tooltips.crit}
                    />
                    <StatPill
                        label={t('stats.sps')}
                        value={`${formatNumber(totalSPS)}/s`}
                        onMouseEnter={() => setActiveTooltip('sps')}
                        onMouseLeave={() => setActiveTooltip(null)}
                        showTooltip={activeTooltip === 'sps'}
                        tooltipContent={tooltips.sps}
                    />
                    <StatPill
                        label={t('stats.relics')}
                        value={`${formatNumber(relics)}`}
                        colorClass="text-amber-600 dark:text-amber-500"
                        onMouseEnter={() => setActiveTooltip('relics')}
                        onMouseLeave={() => setActiveTooltip(null)}
                        showTooltip={activeTooltip === 'relics'}
                        tooltipContent={tooltips.relics}
                    >
                    </StatPill>
                    <StatPill
                        label={t('stats.dust')}
                        value={`${formatNumber(cosmicDust)}`}
                        colorClass="text-purple-600 dark:text-purple-400"
                        onMouseEnter={() => setActiveTooltip('dust')}
                        onMouseLeave={() => setActiveTooltip(null)}
                        showTooltip={activeTooltip === 'dust'}
                        tooltipContent={tooltips.dust}
                    >
                        <CosmicDustIcon className="w-4 h-4" />
                    </StatPill>
                     {ascensionCount > 0 && (
                        <StatPill
                            label={t('stats.essence')}
                            value={`${formatNumber(singularityEssence)}`}
                            colorClass="text-cyan-600 dark:text-cyan-500"
                            onMouseEnter={() => setActiveTooltip('essence')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            showTooltip={activeTooltip === 'essence'}
                            tooltipContent={tooltips.essence}
                        >
                            <SingularityIcon className="w-4 h-4" />
                        </StatPill>
                    )}
                </div>
            </div>
        </div>
    );
};