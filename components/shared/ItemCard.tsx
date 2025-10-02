import React from 'react';
import { TierBonus, Evolution } from '../../types';
import { formatNumber } from '../../utils/format';
import { PurchaseButton } from './PurchaseButton';

interface ItemCardProps {
    name: string;
    level: number;
    cost: number;
    shards: number;
    onPurchase: () => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    buyAmount?: number;
    isPurchased?: boolean;
    tierBonuses?: TierBonus[];
    itemType: 'generator' | 'upgrade';
    totalOutput?: number; // For generators
    baseEffect?: string; // For generators
    specialEffectKey?: string;
    totalEffect?: string; // For upgrades
    effectPerLevel?: string; // For upgrades
    // For generator evolutions
    evolution?: Evolution;
    evolutionChoiceId?: string | null;
    evolutionChoiceId2?: string | null;
    onEvolve?: () => void;
    onPreviewEvolution?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ name, level, cost, shards, onPurchase, t, buyAmount, isPurchased, tierBonuses, itemType, totalOutput, baseEffect, specialEffectKey, totalEffect, effectPerLevel, evolution, evolutionChoiceId, evolutionChoiceId2, onEvolve, onPreviewEvolution }) => {
    const nextBonus = tierBonuses?.find(b => b.count > level);
    const canEvolve = evolution && level >= evolution.milestone && !evolutionChoiceId;
    const chosenEvolution = evolution && evolutionChoiceId ? evolution.choices.find(c => c.id === evolutionChoiceId) : null;
    const chosenEvolution2 = evolution && evolutionChoiceId2 ? evolution.choices.find(c => c.id === evolutionChoiceId2) : null;
    
    return (
        <div className="bg-white/60 dark:bg-slate-800/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight">{name}</h3>
                    <p className="text-md text-slate-500 dark:text-slate-400 font-semibold -mt-1">{t('level_short', {level: formatNumber(level)})}</p>
                  </div>
                  {evolution && onPreviewEvolution && (
                      <button onClick={onPreviewEvolution} className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1.5 rounded-full">{t('card.preview_evolution')}</button>
                  )}
                </div>
                
                <div className="flex items-baseline gap-x-4 gap-y-1 mt-3 flex-wrap">
                    {itemType === 'generator' && (
                        <>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('card.total_output')}</p>
                                <p className="text-lg font-bold text-violet-700 dark:text-violet-400">{formatNumber(totalOutput ?? 0)}/s</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('card.base_sps')}</p>
                                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">+{baseEffect}</p>
                            </div>
                        </>
                    )}
                    {itemType === 'upgrade' && (
                        <>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('card.total_effect')}</p>
                                <p className="text-lg font-bold text-violet-700 dark:text-violet-400">{totalEffect}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('card.effect_per_level')}</p>
                                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{effectPerLevel}</p>
                            </div>
                        </>
                    )}
                </div>
                
                {(nextBonus || specialEffectKey || chosenEvolution) && (
                    <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                        {nextBonus && (
                            <div className="bg-amber-400/10 p-3 rounded-lg opacity-70">
                                <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                                    {t('card.next_bonus_at', { level: nextBonus.count })}
                                </p>
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                                    {t(nextBonus.descriptionKey)}
                                </p>
                            </div>
                        )}
                        {specialEffectKey && (
                           <div className="bg-sky-400/10 p-3 rounded-lg">
                                <p className="text-sm font-bold text-sky-700 dark:text-sky-300">
                                    {t('card.special_effect')}
                                </p>
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                                    {t(specialEffectKey)}
                                </p>
                            </div>
                        )}
                        {chosenEvolution && (
                           <div className="bg-fuchsia-400/10 p-3 rounded-lg">
                                <p className="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">
                                    {t('generator.evolution_title')} (Lv. 100)
                                </p>
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                                    {t(chosenEvolution.descriptionKey)}
                                </p>
                            </div>
                        )}
                         {chosenEvolution2 && (
                           <div className="bg-fuchsia-400/10 p-3 rounded-lg">
                                <p className="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">
                                    {t('generator.evolution_title')} (Lv. 200)
                                </p>
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                                    {t(chosenEvolution2.descriptionKey)}
                                </p>
                            </div>
                        )}
                    </div>
                )}

            </div>
            <div className="flex-shrink-0 w-full md:w-auto mt-2 md:mt-0">
                {canEvolve ? (
                    <button onClick={onEvolve} className="w-full h-14 px-6 rounded-full text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transform active:scale-95 animate-pulse">{t('generator.evolve_button')}</button>
                ) : (
                    <PurchaseButton className="w-full" cost={cost} currency={shards} onPurchase={onPurchase} buyAmount={buyAmount} isPurchased={isPurchased} t={t}/>
                )}
            </div>
        </div>
    )
};
