import React from 'react';
import { useGameHook } from '../../hooks/useGame';
import { formatNumber } from '../../utils/format';
import { ItemCard } from '../shared/ItemCard';
import { Upgrade, Generator } from '../../types';
import { getUpgradeEffectDescription } from './utils';

export const GeneratorsPanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => {
    
    const generatorRelatedUpgrades = game.upgrades.filter(u => 
        ['gen_0_boost', 'gen_1_boost', 'gen_all_boost'].includes(u.id) && u.isUnlocked
    );

    const allItems: ( (Generator & {itemType: 'generator'}) | (Upgrade & {itemType: 'upgrade'}) )[] = [
        ...game.generators.map(g => ({ ...g, itemType: 'generator' as const })),
        ...generatorRelatedUpgrades.map(u => ({ ...u, itemType: 'upgrade' as const }))
    ];

    allItems.sort((a, b) => a.baseCost - b.baseCost);

    return (
        <div className="space-y-3">
            {allItems.map(item => {
                if (item.itemType === 'generator') {
                    const g = item;
                    const amountToBuy = game.buyAmount === 'Max' ? game.calculations.maxAffordable(g.baseCost, g.costMultiplier, g.count, game.shards) : game.buyAmount;
                    const cost = game.calculations.bulkCost(g.baseCost, g.costMultiplier, g.count, amountToBuy);
                    return (
                        <ItemCard 
                            key={g.id}
                            name={t(g.nameKey)} 
                            level={g.count} 
                            cost={cost} 
                            shards={game.shards} 
                            onPurchase={() => game.handleBuy('generator', g.id)} 
                            buyAmount={amountToBuy} 
                            tierBonuses={g.tierBonuses} 
                            t={t} 
                            itemType='generator'
                            totalOutput={game.generatorOutputs[g.id]}
                            baseEffect={formatNumber(g.baseSps)}
                            specialEffectKey={g.specialEffect?.descriptionKey}
                            evolution={g.evolutions?.[0]}
                            evolutionChoiceId={g.evolutionChoiceId}
                            onEvolve={() => game.openEvolutionModal(g.id)}
                        />
                    );
                } else { // upgrade
                    const u = item;
                    const maxLevel = u.maxLevel ?? Infinity;
                    let amountToBuy = game.buyAmount === 'Max' 
                        ? game.calculations.maxAffordable(u.baseCost, u.costMultiplier, u.level, game.shards) 
                        : game.buyAmount;
                    
                    if (u.level + amountToBuy > maxLevel) {
                        amountToBuy = maxLevel - u.level;
                    }

                    const cost = game.calculations.bulkCost(u.baseCost, u.costMultiplier, u.level, amountToBuy);
                    const { perLevel, total } = getUpgradeEffectDescription(u, game.upgradeTotalEffects[u.id] ?? 0, t);

                    return (
                        <ItemCard 
                          key={u.id} 
                          name={t(u.nameKey)} 
                          level={u.level} 
                          cost={cost} 
                          shards={game.shards} 
                          onPurchase={() => game.handleBuy('upgrade', u.id)} 
                          buyAmount={amountToBuy}
                          isPurchased={u.maxLevel !== undefined && u.level >= u.maxLevel}
                          tierBonuses={u.tierBonuses}
                          t={t}
                          itemType='upgrade'
                          effectPerLevel={perLevel}
                          totalEffect={total}
                        />
                    );
                }
            })}
        </div>
    );
}