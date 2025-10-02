import React from 'react';
import { useGameHook } from '../../hooks/useGame';
import { formatNumber, formatDuration } from '../../utils/format';

const StatRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline py-2 px-3 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg">
        <span className="font-semibold text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">{value}</span>
    </div>
);

export const StatsPanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => {
    const { allTimeStats, totalShardsEarned, totalClicks, totalBossDefeats, relicsOnPrestige, currentRunTime, goldenShardsClicked } = game;
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 px-1">{t('stats_panel.title')}</h2>
            
            {/* Current Run Stats */}
            <div className="bg-white/60 dark:bg-slate-800/30 rounded-2xl p-4">
                <h3 className="font-bold text-xl mb-2 text-violet-700 dark:text-violet-400">{t('stats_panel.current_run')}</h3>
                <div className="divide-y divide-slate-200/80 dark:divide-slate-700/80">
                    <StatRow label={t('stats_panel.time_played')} value={formatDuration(currentRunTime)} />
                    <StatRow label={t('stats_panel.shards_earned')} value={formatNumber(totalShardsEarned)} />
                    <StatRow label={t('stats_panel.relics_on_prestige')} value={formatNumber(relicsOnPrestige)} />
                    <StatRow label={t('stats_panel.clicks_made')} value={formatNumber(totalClicks)} />
                    <StatRow label={t('stats_panel.bosses_defeated')} value={formatNumber(totalBossDefeats)} />
                    <StatRow label={t('stats_panel.golden_shards_clicked')} value={formatNumber(goldenShardsClicked)} />
                </div>
            </div>

            {/* All-Time Stats */}
             <div className="bg-white/60 dark:bg-slate-800/30 rounded-2xl p-4">
                <h3 className="font-bold text-xl mb-2 text-cyan-700 dark:text-cyan-400">{t('stats_panel.all_time')}</h3>
                <div className="divide-y divide-slate-200/80 dark:divide-slate-700/80">
                    <StatRow label={t('stats_panel.total_time_played')} value={formatDuration(allTimeStats.totalTimePlayed)} />
                    <StatRow label={t('stats_panel.total_shards_earned')} value={formatNumber(allTimeStats.totalShardsEarned)} />
                    <StatRow label={t('stats_panel.total_clicks')} value={formatNumber(allTimeStats.totalClicks)} />
                    <StatRow label={t('stats_panel.total_boss_defeats')} value={formatNumber(allTimeStats.totalBossDefeats)} />
                    <StatRow label={t('stats_panel.total_prestiges')} value={formatNumber(allTimeStats.totalPrestiges)} />
                    <StatRow label={t('stats_panel.total_ascensions')} value={formatNumber(allTimeStats.totalAscensions)} />
                    <StatRow label={t('stats_panel.highest_sps')} value={`${formatNumber(allTimeStats.highestSPS)}/s`} />
                    <StatRow label={t('stats_panel.highest_spc')} value={formatNumber(allTimeStats.highestSPC)} />
                </div>
            </div>
        </div>
    );
};
