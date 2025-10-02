import React from 'react';
import { Skill } from '../../types';
import { formatNumber } from '../../utils/format';
import { PurchaseButton } from './PurchaseButton';

interface SkillCardProps {
    skill: Skill;
    shards: number;
    onPurchase: () => void;
    onActivate: (id: string) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    buyAmount: number;
    cost: number;
    totalEffect: string;
    effectPerLevel: string;
}
export const SkillCard: React.FC<SkillCardProps> = ({ skill, shards, onPurchase, onActivate, t, buyAmount, cost, totalEffect, effectPerLevel }) => {
    const isLevelable = (skill.maxLevel ?? 1) > 1;
    const isMaxLevel = skill.maxLevel !== undefined && skill.level >= skill.maxLevel;

    return (
        <div className="bg-white/60 dark:bg-slate-800/30 rounded-2xl p-4 flex flex-col gap-4">
            <div>
                <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight">
                    {t(skill.nameKey)} 
                </h3>
                {isLevelable && <p className="text-md text-slate-500 dark:text-slate-400 font-semibold -mt-1">{t('level_short', {level: formatNumber(skill.level)})}</p>}
                <p className="text-base text-slate-600 dark:text-slate-300 mt-2">{t(skill.descriptionKey)}</p>
            </div>

            {isLevelable && (
                 <div className="flex items-baseline gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('card.total_effect')}</p>
                        <p className="text-lg font-bold text-violet-700 dark:text-violet-400">{totalEffect}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('card.effect_per_level')}</p>
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{effectPerLevel}</p>
                    </div>
                </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-2">
                {skill.type === 'ACTIVE' && skill.level > 0 && (
                     <button
                        onClick={() => onActivate(skill.id)}
                        disabled={skill.isActive || (skill.cooldownRemaining ?? 0) > 0}
                        className={`h-14 px-6 w-full rounded-full text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-95 ${
                            (skill.isActive || (skill.cooldownRemaining ?? 0) > 0)
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                : 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm'
                        }`}
                    >
                        {skill.isActive ? t('active', { time: skill.durationRemaining?.toFixed(1) }) : (skill.cooldownRemaining ?? 0) > 0 ? t('cooldown', { time: skill.cooldownRemaining?.toFixed(1) }) : t('activate')}
                    </button>
                )}

                {skill.type === 'PASSIVE' && skill.level > 0 && isMaxLevel && (
                    <div className="h-14 px-6 w-full rounded-full text-lg font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center">{t('owned')}</div>
                )}
                
                {!isMaxLevel && (
                    <PurchaseButton className="w-full" cost={cost} currency={shards} onPurchase={onPurchase} t={t} buyAmount={buyAmount} isPurchased={isMaxLevel} />
                )}
            </div>
        </div>
    );
};
