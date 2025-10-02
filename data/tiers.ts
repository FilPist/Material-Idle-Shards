import { ShardTier } from '../types';

export const SHARD_TIERS: ShardTier[] = [
  { nameKey: 'shard_tier.proto', prestigeRequired: 0, bonus: { type: 'NONE', value: 0, descriptionKey: 'shard_tier_desc.proto' } },
  { nameKey: 'shard_tier.crystal', prestigeRequired: 1, bonus: { type: 'GLOBAL_MULTIPLIER', value: 1.05, descriptionKey: 'shard_tier_desc.crystal' } },
  { nameKey: 'shard_tier.astral', prestigeRequired: 5, bonus: { type: 'GOLDEN_SHARD_CHANCE', value: 0.05, descriptionKey: 'shard_tier_desc.astral' } },
  { nameKey: 'shard_tier.singularity', prestigeRequired: 10, bonus: { type: 'CRIT_DAMAGE_BOOST', value: 0.5, descriptionKey: 'shard_tier_desc.singularity' } },
];
