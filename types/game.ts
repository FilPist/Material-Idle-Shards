import { MiniShard } from './events';

export interface TierBonus {
  count: number;
  type: 'SELF' | 'GLOBAL_SPS' | 'GLOBAL_CLICK';
  multiplier: number;
  descriptionKey: string;
}

export type UpgradeCategory = 'click_add' | 'click_mult' | 'sps_mult' | 'crit';

export interface Upgrade {
  id: string;
  nameKey: string;
  totalEffectKey: string;
  level: number;
  baseCost: number;
  costMultiplier: number;
  effectValue: number;
  effectType?: 'ADD' | 'MULTIPLY_CLICK' | 'MULTIPLY_SPS' | 'CRIT_CHANCE' | 'CRIT_DAMAGE';
  maxLevel?: number;
  tierBonuses?: TierBonus[];
  isUnlocked?: boolean;
  unlockedByAchievementId?: string;
  category: UpgradeCategory;
}

export interface EvolutionChoice {
  id: string;
  nameKey: string;
  descriptionKey: string;
  effect: {
    type: 'SELF_SPS_BOOST' | 'OTHER_GEN_SPS_BOOST' | 'SPS_TO_CLICK_POWER' | 'ADJACENT_SPS_BOOST';
    value: number;
    payload?: {
      targetId?: string;
    }
  };
}

export interface Evolution {
  milestone: number;
  choices: EvolutionChoice[];
}

export interface Generator {
  id: string;
  nameKey: string;
  descriptionKey: string;
  count: number;
  baseCost: number;
  costMultiplier: number;
  baseSps: number;
  tierBonuses: TierBonus[];
  specialEffect?: {
    type: 'BONUS_PER_GENERATOR_TYPE' | 'BONUS_FROM_OTHER_GENERATOR_LEVEL';
    descriptionKey: string;
    payload?: {
      otherGeneratorId?: string;
      bonusPerLevel?: number;
    }
  }
  evolutions?: Evolution[];
  evolutionChoiceId: string | null;
  evolutionChoiceId2: string | null;
}

export interface Skill {
  id: string;
  type: 'PASSIVE' | 'ACTIVE';
  nameKey: string;
  descriptionKey: string;
  totalEffectKey?: string;
  level: number;
  baseCost: number;
  maxLevel?: number;
  costMultiplier?: number;
  effectValue?: number;
  effectType?: 'AUTO_CLICK_CPS' | 'SHARDLING_COUNT' | 'BOSS_DAMAGE_MULTIPLIER';
  duration?: number;
  cooldown?: number;
  isActive?: boolean;
  cooldownRemaining?: number;
  durationRemaining?: number;
  rainingShards?: MiniShard[];
}

export interface Challenge {
  id: string;
  nameKey: string;
  descriptionKey: string;
  goal: number; // Shards required to complete
  reward: {
    descriptionKey: string;
    type: 'PERMANENT_BONUS' | 'UNLOCK_UPGRADE';
    payload?: {
      upgradeId: string;
    }
  };
  restrictions: {
    disabledUpgradeCategories?: UpgradeCategory[];
    spsMultiplier?: number;
    clickMultiplier?: number;
    generatorCostMultiplierFactor?: number;
    forceCrit?: boolean;
    loneGenerator?: string;
  }
}

export interface ShardTier {
  nameKey: string;
  prestigeRequired: number;
  bonus: {
    type: 'GLOBAL_MULTIPLIER' | 'GOLDEN_SHARD_CHANCE' | 'CRIT_DAMAGE_BOOST' | 'NONE';
    value: number;
    descriptionKey: string;
  }
}

export interface SingularityGridNode {
  id: string;
  nameKey: string;
  descriptionKey: string;
  cost: number;
  position: { x: number, y: number };
  prerequisites: string[];
  effect: {
    type: 'PERMANENT_SPS_MULTIPLIER' | 'PERMANENT_CLICK_MULTIPLIER' | 'FREE_GENERATOR_LEVELS' | 'SHARDLING_CRIT_LINK';
    value: number;
  };
}
