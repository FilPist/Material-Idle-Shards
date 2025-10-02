import React from 'react';
import { LoreEntry } from '../../types';
import { useGameHook } from '../../hooks/useGame';

export const LorePanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => {
  const isUnlocked = (entry: LoreEntry): boolean => {
    switch (entry.condition.type) {
      case 'prestigeCount': return game.prestigeCount >= entry.condition.value;
      case 'bossDefeats': return game.totalBossDefeats >= entry.condition.value;
      case 'generatorCount': return (game.generators.find(g => g.id === entry.condition.generatorId)?.count ?? 0) >= entry.condition.value;
      case 'totalShardsEarned': return game.totalShardsEarned >= entry.condition.value;
      default: return false;
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 px-1">{t('lore_panel.title')}</h2>
      {game.loreEntries
        .slice()
        .sort((a, b) => a.condition.value - b.condition.value)
        .map(entry => (
        isUnlocked(entry) ? (
          <div key={entry.id} className="bg-white/60 dark:bg-slate-800/30 rounded-2xl p-5">
            <h3 className="font-extrabold text-xl text-violet-700 dark:text-violet-400">{t(entry.titleKey)}</h3>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-line">{t(entry.textKey)}</p>
          </div>
        ) : (
          <div key={entry.id} className="bg-white/60 dark:bg-slate-800/30 rounded-2xl p-5 text-center opacity-50">
            <p className="font-bold text-slate-500">???</p>
          </div>
        )
      ))}
    </div>
  );
};