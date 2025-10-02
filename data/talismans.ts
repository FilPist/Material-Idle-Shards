import { Talisman } from '../types';

export const INITIAL_TALISMANS: Talisman[] = [
    {
        id: 'talisman_crit',
        nameKey: 'talisman.crit.name',
        descriptionKey: 'talisman.crit.desc',
        cost: 25,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 10, costMultiplier: 1.8,
        effect: { type: 'CRIT_BOOST', value: 0.02, secondaryValue: 0.25 } // +2% crit chance, +25% crit damage
    },
    {
        id: 'talisman_golden',
        nameKey: 'talisman.golden.name',
        descriptionKey: 'talisman.golden.desc',
        cost: 50,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 10, costMultiplier: 2,
        effect: { type: 'GOLDEN_SHARD_BOOST', value: 1.5 } // 1.5x spawn chance and reward
    },
    {
        id: 'talisman_offline',
        nameKey: 'talisman.offline.name',
        descriptionKey: 'talisman.offline.desc',
        cost: 75,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 1, costMultiplier: 1, // Max level 1 for this one
        effect: { type: 'OFFLINE_SPS_BOOST', value: 2 } // Offline progress is 2x more effective
    },
    {
        id: 'talisman_relic_power',
        nameKey: 'talisman.relic_power.name',
        descriptionKey: 'talisman.relic_power.desc',
        cost: 100,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 10, costMultiplier: 2.2,
        effect: { type: 'IDLE_SPS_BOOST_PER_RELIC', value: 0.001 } // +0.1% SPS per unspent Relic
    },
    {
        id: 'talisman_patient_hand',
        nameKey: 'talisman.patient_hand.name',
        descriptionKey: 'talisman.patient_hand.desc',
        cost: 125,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 10, costMultiplier: 1.9,
        effect: { type: 'SHARDLING_SPS_BOOST', value: 2 } // Shardlings are 2x as effective
    },
    {
        id: 'talisman_boss_hunter',
        nameKey: 'talisman.boss_hunter.name',
        descriptionKey: 'talisman.boss_hunter.desc',
        cost: 150,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 10, costMultiplier: 1.7,
        effect: { type: 'BOSS_DUST_MULTIPLIER', value: 2 } // 2x dust from bosses
    },
    {
        id: 'talisman_stored_power',
        nameKey: 'talisman.stored_power.name',
        descriptionKey: 'talisman.stored_power.desc',
        cost: 200,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 5, costMultiplier: 2.5,
        effect: { type: 'STORED_POWER_BONUS', value: 1 } // base multiplier for stored power buff
    },
    {
        id: 'talisman_alchemist',
        nameKey: 'talisman.alchemist.name',
        descriptionKey: 'talisman.alchemist.desc',
        cost: 300,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 5, costMultiplier: 3,
        effect: { type: 'RELIC_ON_CLICK_CHANCE', value: 0.0001 } // 0.01% chance on click to get 1 relic
    },
    {
        id: 'talisman_momentum',
        nameKey: 'talisman.momentum.name',
        descriptionKey: 'talisman.momentum.desc',
        cost: 400,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 10, costMultiplier: 2,
        effect: { type: 'MOMENTUM_CLICK_BOOST', value: 0.01, secondaryValue: 10 } // +1% click power per click, max 10 stacks.
    },
    {
        id: 'talisman_hoarder',
        nameKey: 'talisman.hoarder.name',
        descriptionKey: 'talisman.hoarder.desc',
        cost: 500,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 1, costMultiplier: 1,
        effect: { type: 'SHARD_CAP_SPS_BOOST', value: 3 } // x3 SPS when near shard cap.
    },
    {
        id: 'talisman_collector',
        nameKey: 'talisman.collector.name',
        descriptionKey: 'talisman.collector.desc',
        cost: 600,
        isCrafted: false,
        equippedInLoadouts: [],
        level: 0, maxLevel: 1, costMultiplier: 1,
        effect: { type: 'AUTO_COLLECT_GOLDEN_SHARD', value: 0.5 } // auto-collect at 50% effectiveness.
    }
];
