import React, { useState } from 'react';
import { PrestigeUpgrade, AscensionUpgrade, Challenge } from '../../types';
import { useGameHook } from '../../hooks/useGame';
import { SingularityIcon, PrestigeIcon } from '../icons';
import { PurchaseButton } from '../shared/PurchaseButton';
import { formatNumber } from '../../utils/format';
import { SingularityGridPanel } from './SingularityGridPanel';

const PrestigeUpgradeCard: React.FC<{
    upgrade: PrestigeUpgrade,
    relics: number,
    onPurchase: (id: string) => void,
    t: (key: string, replacements?: { [key: string]: string | number }) => string
}> = ({ upgrade, relics, onPurchase, t }) => {
    const isMaxed = upgrade.level >= upgrade.maxLevel;
    const canAfford = relics >= upgrade.cost;
    return (
        <div className={`bg-white/60 dark:bg-slate-800/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${!canAfford && !isMaxed ? 'opacity-60' : ''}`}>
            <div className="flex-1">
                <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight">
                    {t(upgrade.nameKey)}
                </h3>
                <p className="text-md text-slate-500 dark:text-slate-400 font-semibold -mt-1">{upgrade.level}/{upgrade.maxLevel}</p>
                <p className="text-base text-slate-600 dark:text-slate-300 mt-2">{t(upgrade.descriptionKey, { value: upgrade.effectValue * 100 })}</p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
                <PurchaseButton 
                    className="w-full"
                    cost={upgrade.cost}
                    currency={relics}
                    onPurchase={() => onPurchase(upgrade.id)}
                    isPurchased={isMaxed}
                    t={t}
                    currencyIcon={<PrestigeIcon className="w-6 h-6 text-amber-300"/>}
                />
            </div>
        </div>
    )
}

const ChallengeCard: React.FC<{
  challenge: Challenge,
  game: useGameHook,
  t: (key: string, replacements?: { [key: string]: string | number }) => string
}> = ({ challenge, game, t }) => {
    const isCompleted = game.completedChallengeIds.includes(challenge.id);
    const isActive = game.activeChallengeId === challenge.id;

    return (
        <div className={`bg-white/60 dark:bg-slate-800/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
             <div className="flex-1">
                <div className="flex items-center gap-3">
                    {isCompleted && <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>}
                    <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight">{t(challenge.nameKey)}</h3>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 mt-1 md:pl-6">{t(challenge.descriptionKey)}</p>
                <div className="mt-3 md:pl-6">
                    <div className="bg-teal-400/10 p-3 rounded-lg">
                        <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
                            {t('challenge.reward')}
                        </p>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                            {t(challenge.reward.descriptionKey)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
                {isCompleted ? (
                    <div className="h-14 px-6 rounded-full text-lg font-bold bg-green-500/20 text-green-700 dark:text-green-300 flex items-center justify-center">{t('challenge.completed')}</div>
                ) : isActive ? (
                    <button onClick={game.handleExitChallenge} className="h-14 w-full px-6 rounded-full text-lg font-bold bg-red-500/80 hover:bg-red-600 text-white shadow-md">{t('challenge.exit')}</button>
                ) : (
                    <button onClick={() => game.handleStartChallenge(challenge.id)} disabled={!!game.activeChallengeId} className="h-14 w-full px-6 rounded-full text-lg font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed">{t('challenge.start')}</button>
                )}
            </div>
        </div>
    )
}

const PrestigeTreePanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => (
    <div className="space-y-3">
        {game.prestigeUpgrades
            .slice()
            .sort((a, b) => a.cost - b.cost)
            .map(pu => (
                <PrestigeUpgradeCard 
                    key={pu.id}
                    upgrade={pu}
                    relics={game.relics}
                    onPurchase={game.handleBuyPrestigeUpgrade}
                    t={t}
                />
        ))}
    </div>
);

const ChallengesPanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => (
     <div className="space-y-3">
        {game.challenges
            .slice()
            .sort((a, b) => a.goal - b.goal)
            .map(c => (
                <ChallengeCard key={c.id} challenge={c} game={game} t={t} />
        ))}
     </div>
);

const AscensionPanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => (
    <div className="h-full flex flex-col">
         <div className="flex-shrink-0 text-center p-4 border-b-2 border-slate-200 dark:border-slate-700/50">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('ascension_panel.singularity_grid')}</h2>
            <p className="max-w-md mx-auto text-slate-600 dark:text-slate-300 mt-1">{t('ascension_panel.tree_desc')}</p>
            <div className="mt-4">
                <button 
                    onClick={() => game.setShowAscensionModal(true)} 
                    disabled={!game.canAscend} 
                    className="px-6 py-3 rounded-full text-md font-bold transition-all duration-200 transform active:scale-95 text-white bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 disabled:dark:bg-slate-600 disabled:text-slate-500 disabled:dark:text-slate-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                    {t('ascension_panel.button')} ({t('ascension_panel.gain', { essence: formatNumber(game.essenceOnAscension) })})
                </button>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('ascension_panel.requirement', { req: formatNumber(game.ascensionReqRelics) })}</p>
            </div>
        </div>
        <div className="flex-grow p-1 md:p-2">
            <SingularityGridPanel game={game} t={t} />
        </div>
    </div>
);

export const PrestigePanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => {
  const [subTab, setSubTab] = useState<'tree' | 'challenges' | 'ascension'>('tree');
  const activeChallenge = game.challenges.find(c => c.id === game.activeChallengeId);

  return (
    <div className="h-full flex flex-col">
        {game.activeChallengeId && (
            <div className="flex-shrink-0 text-center p-4 bg-violet-600 text-white rounded-t-xl">
                <h3 className="font-bold text-lg">{t('challenge.active_title')}</h3>
                <p>{t(activeChallenge?.nameKey ?? '')}</p>
                <p className="text-sm opacity-80">{t('challenge.goal', { shards: formatNumber(activeChallenge?.goal ?? 0) })}</p>
            </div>
        )}

        <div className="flex-shrink-0 text-center p-4 border-b-2 border-slate-200 dark:border-slate-700/50">
            {!game.activeChallengeId && (
              <>
                 <button 
                    onClick={() => game.setShowPrestigeModal(true)} 
                    disabled={!game.canPrestige} 
                    className="px-6 py-3 rounded-full text-md font-bold transition-all duration-200 transform active:scale-95 text-white bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:dark:bg-slate-600 disabled:text-slate-500 disabled:dark:text-slate-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                    {t('prestige_panel.button')} ({t('prestige_panel.gain', { relics: formatNumber(game.relicsOnPrestige) })})
                </button>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('prestige_panel.requirement', { req: formatNumber(game.prestigeReq) })}</p>
              </>
            )}
        </div>

        <div className="flex-shrink-0 p-2 grid grid-cols-2 md:grid-cols-3 gap-2 border-b border-slate-200 dark:border-slate-700/50">
            <button onClick={() => setSubTab('tree')} className={`py-2 rounded-lg font-bold ${subTab === 'tree' ? 'text-violet-600 dark:text-violet-400 bg-violet-500/10' : 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}>{t('prestige_panel.tree_title')}</button>
            <button onClick={() => setSubTab('challenges')} className={`py-2 rounded-lg font-bold ${subTab === 'challenges' ? 'text-violet-600 dark:text-violet-400 bg-violet-500/10' : 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}>{t('challenge.panel_title')}</button>
            {game.ascensionCount > 0 && <button onClick={() => setSubTab('ascension')} className={`py-2 rounded-lg font-bold ${subTab === 'ascension' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}>{t('ascension_panel.panel_title')}</button>}
        </div>
        
        <div className="flex-grow overflow-y-auto custom-scrollbar p-3 md:p-4">
            {subTab === 'tree' && <PrestigeTreePanel game={game} t={t} />}
            {subTab === 'challenges' && <ChallengesPanel game={game} t={t} />}
            {subTab === 'ascension' && <AscensionPanel game={game} t={t} />}
        </div>
    </div>
  );
}