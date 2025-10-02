import React from 'react';
import { Achievement } from '../../types';
import { useGameHook } from '../../hooks/useGame';
import { formatNumber } from '../../utils/format';

interface AchievementCardProps {
    achievement: Achievement;
    progress: number;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}
const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, progress, t }) => {
    const isUnlocked = achievement.isUnlocked;
    return (
        <div className={`bg-white/60 dark:bg-slate-800/30 rounded-2xl p-4 transition-all duration-300 ${!isUnlocked && 'opacity-60'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight">{t(achievement.nameKey)}</h3>
                    <p className="text-base text-slate-600 dark:text-slate-300 mt-1">{t(achievement.descriptionKey)}</p>
                    <div className="mt-3">
                         <div className="bg-teal-400/10 p-3 rounded-lg">
                            <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
                                {t('achievements_panel.bonus_prefix')}
                            </p>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                                {t(achievement.bonus.descriptionKey, { value: achievement.bonus.value })}
                            </p>
                        </div>
                    </div>
                </div>
                {isUnlocked && (
                    <div className="flex-shrink-0 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
            {!isUnlocked && progress < 1 && (
                <div className="mt-3">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-violet-600 h-2.5 rounded-full" style={{ width: `${progress * 100}%` }}></div>
                    </div>
                     <p className="text-right text-xs font-semibold text-slate-500 mt-1">{formatNumber(progress * achievement.condition.value)} / {formatNumber(achievement.condition.value)}</p>
                </div>
            )}
        </div>
    )
};

export const AchievementsPanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => {
    const getProgress = (ach: Achievement): number => {
        if (ach.isUnlocked) return 1;
        switch(ach.condition.type) {
            case 'totalShardsEarned': return Math.min(game.totalShardsEarned / ach.condition.value, 1);
            case 'totalClicks': return Math.min(game.totalClicks / ach.condition.value, 1);
            case 'generatorCount':
                const gen = game.generators.find(g => g.id === ach.condition.generatorId);
                return Math.min((gen?.count ?? 0) / ach.condition.value, 1);
            case 'prestigeCount': return Math.min(game.prestigeCount / ach.condition.value, 1);
            case 'haveOneOfEachGenerator':
                const ownedCount = game.generators.filter(g => g.count > 0).length;
                return Math.min(ownedCount / ach.condition.value, 1);
            case 'bossDefeats': return Math.min(game.totalBossDefeats / ach.condition.value, 1);
            default: return 0;
        }
    };
    
    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 px-1">{t('achievements_panel.title')}</h2>
            {game.achievements
                .slice()
                .sort((a, b) => a.condition.value - b.condition.value)
                .map(ach => (
                    <AchievementCard key={ach.id} achievement={ach} progress={getProgress(ach)} t={t} />
            ))}
        </div>
    );
};