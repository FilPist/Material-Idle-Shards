import React from 'react';
import { useGameHook } from '../../hooks/useGame';
import { ItemCard } from '../shared/ItemCard';
import { getUpgradeEffectDescription } from './utils';

export const UpgradesPanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => {
    
    const generatorUpgradeIds = ['gen_0_boost', 'gen_1_boost', 'gen_all_boost'];
    const visibleUpgrades = game.upgrades.filter(u => 
        u.isUnlocked && 
        !generatorUpgradeIds.includes(u.id) && 
        (!game.activeChallengeId || !game.challengeModifiers.disabledUpgradeCategories.includes(u.category))
    );

    return (
        <div className="space-y-3">
          {visibleUpgrades
            .sort((a, b) => a.baseCost - b.baseCost)
            .map(u => {
              const maxLevel = u.maxLevel ?? Infinity;
              let amountToBuy = game.buyAmount === 'Max' 
                  ? game.calculations.maxAffordable(u.baseCost, u.costMultiplier, u.level, game.shards) 
                  : game.buyAmount;
              
              if (u.level + amountToBuy > maxLevel) {
                  amountToBuy = maxLevel - u.level;
              }

              const cost = game.calculations.bulkCost(u.baseCost, u.costMultiplier, u.level, amountToBuy);
              const { perLevel, total } = getUpgradeEffectDescription(u, game.upgradeTotalEffects[u.id] ?? 0, t);
              return <ItemCard 
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
          })}
          {game.activeChallengeId && visibleUpgrades.length === 0 && (
            <div className="text-center p-6 bg-red-500/10 rounded-xl">
              <p className="font-bold text-red-700 dark:text-red-300">{t('challenge.upgrades_disabled')}</p>
            </div>
          )}
        </div>
    );
};
