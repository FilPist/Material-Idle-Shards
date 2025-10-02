import { PrestigeUpgrade } from '../types';

export const INITIAL_PRESTIGE_UPGRADES: PrestigeUpgrade[] = [
    { id: 'prestige_sps_1', nameKey: 'prestige_upgrade.sps_1.name', descriptionKey: 'prestige_upgrade.sps_1.desc', level: 0, maxLevel: 20, cost: 1, effectValue: 0.05, effectType: 'GLOBAL_SPS_MULTIPLIER' },
    { id: 'prestige_click_1', nameKey: 'prestige_upgrade.click_1.name', descriptionKey: 'prestige_upgrade.click_1.desc', level: 0, maxLevel: 20, cost: 1, effectValue: 0.05, effectType: 'GLOBAL_CLICK_MULTIPLIER' },
    { id: 'prestige_relic_gain', nameKey: 'prestige_upgrade.relic_gain.name', descriptionKey: 'prestige_upgrade.relic_gain.desc', level: 0, maxLevel: 10, cost: 10, effectValue: 0.02, effectType: 'RELIC_GAIN_MULTIPLIER' },
    { id: 'prestige_crit_dmg_1', nameKey: 'prestige_upgrade.crit_dmg_1.name', descriptionKey: 'prestige_upgrade.crit_dmg_1.desc', level: 0, maxLevel: 10, cost: 5, effectValue: 0.1, effectType: 'CRIT_DAMAGE_BONUS' },
    { id: 'prestige_start_shards', nameKey: 'prestige_upgrade.start_shards.name', descriptionKey: 'prestige_upgrade.start_shards.desc', level: 0, maxLevel: 1, cost: 20, effectValue: 10000, effectType: 'STARTING_SHARDS' },
    { id: 'prestige_talisman_slot', nameKey: 'prestige_upgrade.talisman_slot.name', descriptionKey: 'prestige_upgrade.talisman_slot.desc', level: 0, maxLevel: 2, cost: 50, effectValue: 1, effectType: 'TALISMAN_SLOTS' },
    { id: 'prestige_base_gen_power', nameKey: 'prestige_upgrade.base_gen_power.name', descriptionKey: 'prestige_upgrade.base_gen_power.desc', level: 0, maxLevel: 10, cost: 50, effectValue: 0.1, effectType: 'BASE_GENERATOR_SPS_MULTIPLIER' },
    { id: 'prestige_golden_shard_mastery', nameKey: 'prestige_upgrade.golden_shard.name', descriptionKey: 'prestige_upgrade.golden_shard.desc', level: 0, maxLevel: 10, cost: 25, effectValue: 0.1, effectType: 'GOLDEN_SHARD_REWARD_MULTIPLIER' },
    { id: 'prestige_boss_slayer_ability', nameKey: 'prestige_upgrade.boss_cooldown.name', descriptionKey: 'prestige_upgrade.boss_cooldown.desc', level: 0, maxLevel: 5, cost: 30, effectValue: 0.05, effectType: 'BOSS_COOLDOWN_REDUCTION' },
    { id: 'prestige_legacy_of_power', nameKey: 'prestige_upgrade.sps_to_click.name', descriptionKey: 'prestige_upgrade.sps_to_click.desc', level: 0, maxLevel: 10, cost: 100, effectValue: 0.0001, effectType: 'SPS_TO_CLICK_CONVERSION' },
];