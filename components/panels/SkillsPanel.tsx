import React from 'react';
import { useGameHook } from '../../hooks/useGame';
import { SkillCard } from '../shared/SkillCard';
import { getSkillEffectDescription } from './utils';

export const SkillsPanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => {
    return (
        <div className="space-y-3">
            {game.skills
                .slice()
                .sort((a, b) => a.baseCost - b.baseCost)
                .map(s => {
                 const maxLevel = s.maxLevel ?? Infinity;
                 let amountToBuy = (s.costMultiplier && game.buyAmount === 'Max') 
                    ? game.calculations.maxAffordable(s.baseCost, s.costMultiplier, s.level, game.shards)
                    : (game.buyAmount === 'Max' ? (game.shards >= s.baseCost ? 1 : 0) : game.buyAmount);

                if (s.level + amountToBuy > maxLevel) {
                    amountToBuy = maxLevel - s.level;
                }
                
                const cost = game.calculations.bulkCost(s.baseCost, s.costMultiplier ?? 1, s.level, amountToBuy);
                const { perLevel, total } = getSkillEffectDescription(s, game.upgradeTotalEffects[s.id] ?? 0, t);

                return (
                    <SkillCard 
                        key={s.id} 
                        skill={s} 
                        shards={game.shards} 
                        onPurchase={() => game.handleBuy('skill', s.id)} 
                        onActivate={game.handleActivateSkill} 
                        t={t}
                        buyAmount={amountToBuy}
                        cost={cost}
                        totalEffect={total}
                        effectPerLevel={perLevel}
                    />
                );
            })}
        </div>
    );
};