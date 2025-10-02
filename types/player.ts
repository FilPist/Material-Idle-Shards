import { UpgradeCategory } from './game';

export interface AchievementBonus {
  type: 'GLOBAL_SPS_MULTIPLIER' | 'GLOBAL_CLICK_MULTIPLIER' | 'CRIT_DAMAGE_BONUS' | 'BASE_CLICK_BONUS' | 'UNLOCK_UPGRADE' | 'GRANT_RELICS';
  value: number;
  payload?: {
    upgradeId?: string;
  };
  descriptionKey: string;
}

export type AchievementConditionType = 'totalShardsEarned' | 'totalClicks' | 'generatorCount' | 'prestigeCount' | 'haveOneOfEachGenerator' | 'bossDefeats' | 'ascensionCount' | 'talismansCrafted' | 'challengesCompleted';

export interface Achievement {
  id: string;
  nameKey: string;
  descriptionKey: string;
  isUnlocked: boolean;
  condition: {
    type: AchievementConditionType;
    value: number;
    generatorId?: string;
  };
  bonus: AchievementBonus;
}

export interface FixedBossData {
    id: string;
    nameKey: string;
    hp: number;
    reward: number;
    unlockCondition: {
        type: 'totalShardsEarned' | 'prestigeCount';
        value: number;
    };
}

export interface Talisman {
  id: string;
  nameKey: string;
  descriptionKey: string;
  cost: number; // in Cosmic Dust
  isCrafted: boolean;
  equippedInLoadouts: number[]; // e.g., [1], [2], [1, 2]
  level: number;
  maxLevel: number;
  costMultiplier: number;
  effect: {
    type: 'GOLDEN_SHARD_BOOST' | 'CRIT_BOOST' | 'OFFLINE_SPS_BOOST' | 'IDLE_SPS_BOOST_PER_RELIC' | 'SHARDLING_SPS_BOOST' | 'BOSS_DUST_MULTIPLIER' | 'STORED_POWER_BONUS' | 'RELIC_ON_CLICK_CHANCE' | 'MOMENTUM_CLICK_BOOST' | 'SHARD_CAP_SPS_BOOST' | 'AUTO_COLLECT_GOLDEN_SHARD';
    value: number;
    secondaryValue?: number;
  };
}

export interface PrestigeUpgrade {
  id: string;
  nameKey: string;
  descriptionKey: string;
  level: number;
  maxLevel: number;
  cost: number;
  effectValue: number;
  effectType: 'GLOBAL_SPS_MULTIPLIER' | 'GLOBAL_CLICK_MULTIPLIER' | 'CRIT_DAMAGE_BONUS' | 'STARTING_SHARDS' | 'RELIC_GAIN_MULTIPLIER' | 'TALISMAN_SLOTS' | 'GOLDEN_SHARD_REWARD_MULTIPLIER' | 'BOSS_COOLDOWN_REDUCTION' | 'SPS_TO_CLICK_CONVERSION' | 'BASE_GENERATOR_SPS_MULTIPLIER';
}

export interface AscensionUpgrade {
  id: string;
  nameKey: string;
  descriptionKey: string;
  level: number;
  maxLevel: number;
  cost: number; // Cost in Singularity Essence
  effectValue: number;
  effectType: 'RELIC_GAIN_MULTIPLIER' | 'GLOBAL_SPS_MULTIPLIER' | 'GLOBAL_CLICK_MULTIPLIER' | 'PRESTIGE_UPGRADE_POWER';
}

export interface LoreEntry {
  id: string;
  titleKey: string;
  textKey: string;
  condition: {
    type: 'prestigeCount' | 'bossDefeats' | 'generatorCount' | 'totalShardsEarned';
    value: number;
    generatorId?: string;
  };
}

export interface AllTimeStats {
  totalTimePlayed: number; // in ms
  totalShardsEarned: number;
  totalClicks: number;
  totalBossDefeats: number;
  totalPrestiges: number;
  totalAscensions: number;
  highestSPS: number;
  highestSPC: number;
}
