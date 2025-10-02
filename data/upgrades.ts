import { Upgrade } from '../types';

export const INITIAL_UPGRADES: Upgrade[] = [
  // Early Game: Base Click Power
  { id: 'click_1', nameKey: 'upgrade.click_1.name', totalEffectKey: 'upgrade.click_1.total_effect', level: 0, baseCost: 10, costMultiplier: 1.15, effectValue: 1, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 25, type: 'GLOBAL_CLICK', multiplier: 1.1, descriptionKey: 'bonus.global_click_10' },
    { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.15, descriptionKey: 'bonus.global_click_15' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.25, descriptionKey: 'bonus.global_click_25' },
    { count: 200, type: 'GLOBAL_CLICK', multiplier: 1.5, descriptionKey: 'bonus.global_click_50' },
  ]},
  { id: 'reinforced_core', nameKey: 'upgrade.reinforced_core.name', totalEffectKey: 'upgrade.reinforced_core.total_effect', level: 0, baseCost: 150, costMultiplier: 1.25, effectValue: 5, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 25, type: 'GLOBAL_SPS', multiplier: 1.05, descriptionKey: 'bonus.global_sps_5' },
    { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.1, descriptionKey: 'bonus.global_click_10' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    { count: 200, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
  ]},
  { id: 'gen_0_boost', nameKey: 'upgrade.gen_0_boost.name', totalEffectKey: 'upgrade.gen_0_boost.total_effect', level: 0, baseCost: 500, costMultiplier: 1.8, effectValue: 0.05, effectType: 'MULTIPLY_SPS', isUnlocked: true, category: 'sps_mult', tierBonuses: [
    { count: 25, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.1, descriptionKey: 'bonus.global_click_10' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.2, descriptionKey: 'bonus.global_sps_20' },
    { count: 200, type: 'GLOBAL_SPS', multiplier: 1.5, descriptionKey: 'bonus.global_sps_50' },
  ]},
  // Early-Mid Game: Introduction to Multipliers & more Base Click
  { id: 'click_2', nameKey: 'upgrade.click_2.name', totalEffectKey: 'upgrade.click_2.total_effect', level: 0, baseCost: 2000, costMultiplier: 1.5, effectValue: 0.05, effectType: 'MULTIPLY_CLICK', isUnlocked: true, category: 'click_mult', tierBonuses: [
    { count: 25, type: 'GLOBAL_SPS', multiplier: 1.05, descriptionKey: 'bonus.global_sps_5' },
    { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.1, descriptionKey: 'bonus.global_click_10' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.2, descriptionKey: 'bonus.global_click_20' },
    { count: 200, type: 'GLOBAL_CLICK', multiplier: 1.5, descriptionKey: 'bonus.global_click_50' },
  ]},
  { id: 'empowered_strikes', nameKey: 'upgrade.empowered_strikes.name', totalEffectKey: 'upgrade.empowered_strikes.total_effect', level: 0, baseCost: 4000, costMultiplier: 1.3, effectValue: 10, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 25, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.1, descriptionKey: 'bonus.global_click_10' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.15, descriptionKey: 'bonus.global_click_15' },
    { count: 200, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
  ]},
  { id: 'gen_1_boost', nameKey: 'upgrade.gen_1_boost.name', totalEffectKey: 'upgrade.gen_1_boost.total_effect', level: 0, baseCost: 10000, costMultiplier: 2, effectValue: 0.1, effectType: 'MULTIPLY_SPS', isUnlocked: true, category: 'sps_mult', tierBonuses: [
    { count: 25, type: 'GLOBAL_SPS', multiplier: 1.2, descriptionKey: 'bonus.global_sps_20' },
    { count: 50, type: 'GLOBAL_SPS', multiplier: 1.2, descriptionKey: 'bonus.global_sps_20' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.2, descriptionKey: 'bonus.global_click_20' },
    { count: 200, type: 'GLOBAL_SPS', multiplier: 1.5, descriptionKey: 'bonus.global_sps_50' },
  ]},
  // Mid Game: Critical Hits
  { id: 'crit_chance_1', nameKey: 'upgrade.crit_chance_1.name', totalEffectKey: 'upgrade.crit_chance_1.total_effect', level: 0, baseCost: 7500, costMultiplier: 1.5, effectValue: 0.005, effectType: 'CRIT_CHANCE', maxLevel: 100, isUnlocked: true, category: 'crit', tierBonuses: [
    { count: 25, type: 'GLOBAL_CLICK', multiplier: 1.1, descriptionKey: 'bonus.global_click_10' },
    { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.2, descriptionKey: 'bonus.global_click_20' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    // No bonus at 200 because maxLevel is 100
  ]},
  { id: 'crit_damage_1', nameKey: 'upgrade.crit_damage_1.name', totalEffectKey: 'upgrade.crit_damage_1.total_effect', level: 0, baseCost: 50000, costMultiplier: 1.8, effectValue: 0.1, effectType: 'CRIT_DAMAGE', isUnlocked: true, category: 'crit', tierBonuses: [
    { count: 25, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    { count: 50, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.1, descriptionKey: 'bonus.global_click_10' },
    { count: 200, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
  ]},
  { id: 'shattering_force', nameKey: 'upgrade.shattering_force.name', totalEffectKey: 'upgrade.shattering_force.total_effect', level: 0, baseCost: 75000, costMultiplier: 1.4, effectValue: 50, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 25, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.15, descriptionKey: 'bonus.global_click_15' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.15, descriptionKey: 'bonus.global_sps_15' },
    { count: 200, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
  ]},
  { id: 'click_3', nameKey: 'upgrade.click_3.name', totalEffectKey: 'upgrade.click_3.total_effect', level: 0, baseCost: 100000, costMultiplier: 1.8, effectValue: 0.08, effectType: 'MULTIPLY_CLICK', isUnlocked: true, category: 'click_mult', tierBonuses: [
    { count: 25, type: 'GLOBAL_CLICK', multiplier: 1.15, descriptionKey: 'bonus.global_click_15' },
    { count: 50, type: 'GLOBAL_SPS', multiplier: 1.15, descriptionKey: 'bonus.global_sps_15' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.25, descriptionKey: 'bonus.global_click_25' },
    { count: 200, type: 'GLOBAL_CLICK', multiplier: 1.5, descriptionKey: 'bonus.global_click_50' },
  ]},
  { id: 'reality_breaker', nameKey: 'upgrade.reality_breaker.name', totalEffectKey: 'upgrade.reality_breaker.total_effect', level: 0, baseCost: 500000, costMultiplier: 1.5, effectValue: 100, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 25, type: 'GLOBAL_CLICK', multiplier: 1.2, descriptionKey: 'bonus.global_click_20' },
    { count: 50, type: 'GLOBAL_SPS', multiplier: 1.2, descriptionKey: 'bonus.global_sps_20' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.2, descriptionKey: 'bonus.global_click_20' },
    { count: 200, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
  ]},
  // Late Game: Large Global Boosts & Click Rebalance
  { id: 'click_add_1k', nameKey: 'upgrade.click_add_1k.name', totalEffectKey: 'upgrade.click_add_1k.total_effect', level: 0, baseCost: 1e6, costMultiplier: 1.5, effectValue: 1000, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 100, type: 'GLOBAL_SPS', multiplier: 2, descriptionKey: 'bonus.global_sps_100' },
    { count: 200, type: 'GLOBAL_CLICK', multiplier: 2, descriptionKey: 'bonus.global_click_100' },
  ] },
  { id: 'click_add_10k', nameKey: 'upgrade.click_add_10k.name', totalEffectKey: 'upgrade.click_add_10k.total_effect', level: 0, baseCost: 5e7, costMultiplier: 1.6, effectValue: 10000, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 100, type: 'GLOBAL_SPS', multiplier: 2, descriptionKey: 'bonus.global_sps_100' },
    { count: 200, type: 'GLOBAL_CLICK', multiplier: 2, descriptionKey: 'bonus.global_click_100' },
  ] },
   { id: 'giga_strike', nameKey: 'upgrade.giga_strike.name', totalEffectKey: 'upgrade.giga_strike.total_effect', level: 0, baseCost: 1e9, costMultiplier: 1.7, effectValue: 100000, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 100, type: 'GLOBAL_SPS', multiplier: 2, descriptionKey: 'bonus.global_sps_100' },
    { count: 200, type: 'GLOBAL_CLICK', multiplier: 2, descriptionKey: 'bonus.global_click_100' },
  ] },
   { id: 'ultimate_strike', nameKey: 'upgrade.ultimate_strike.name', totalEffectKey: 'upgrade.ultimate_strike.total_effect', level: 0, baseCost: 5e10, costMultiplier: 1.8, effectValue: 1000000, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 100, type: 'GLOBAL_SPS', multiplier: 2, descriptionKey: 'bonus.global_sps_100' },
    { count: 200, type: 'GLOBAL_CLICK', multiplier: 2, descriptionKey: 'bonus.global_click_100' },
  ] },
  { id: 'kinetic_conversion', nameKey: 'upgrade.kinetic_conversion.name', totalEffectKey: 'upgrade.kinetic_conversion.total_effect', level: 0, baseCost: 1e11, costMultiplier: 10, maxLevel: 200, effectValue: 0.0001, effectType: 'ADD', isUnlocked: true, category: 'click_add', tierBonuses: [
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.5, descriptionKey: 'bonus.global_click_50' },
    { count: 200, type: 'GLOBAL_SPS', multiplier: 1.5, descriptionKey: 'bonus.global_sps_50' },
  ] },
  { id: 'click_4', nameKey: 'upgrade.click_4.name', totalEffectKey: 'upgrade.click_4.total_effect', level: 0, baseCost: 1e8, costMultiplier: 2.5, effectValue: 0.5, effectType: 'MULTIPLY_CLICK', isUnlocked: true, category: 'click_mult', tierBonuses: [
    { count: 25, type: 'GLOBAL_CLICK', multiplier: 1.5, descriptionKey: 'bonus.global_click_50' },
    { count: 50, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.5, descriptionKey: 'bonus.global_click_50' },
    { count: 200, type: 'GLOBAL_CLICK', multiplier: 2, descriptionKey: 'bonus.global_click_100' },
  ]},
  { id: 'gen_all_boost', nameKey: 'upgrade.gen_all_boost.name', totalEffectKey: 'upgrade.gen_all_boost.total_effect', level: 0, baseCost: 5e10, costMultiplier: 2.5, effectValue: 0.20, effectType: 'MULTIPLY_SPS', isUnlocked: true, category: 'sps_mult', tierBonuses: [
      { count: 25, type: 'GLOBAL_SPS', multiplier: 1.5, descriptionKey: 'bonus.global_sps_50' },
      { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.25, descriptionKey: 'bonus.global_click_25' },
      { count: 100, type: 'GLOBAL_SPS', multiplier: 2, descriptionKey: 'bonus.global_sps_100' },
      { count: 200, type: 'GLOBAL_SPS', multiplier: 2, descriptionKey: 'bonus.global_sps_100' },
    ]
  },
  { id: 'click_5', nameKey: 'upgrade.click_5.name', totalEffectKey: 'upgrade.click_5.total_effect', level: 0, baseCost: 1e11, costMultiplier: 3, effectValue: 1.0, effectType: 'MULTIPLY_CLICK', isUnlocked: true, category: 'click_mult', tierBonuses: [
    { count: 25, type: 'GLOBAL_SPS', multiplier: 1.5, descriptionKey: 'bonus.global_sps_50' },
    { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.5, descriptionKey: 'bonus.global_click_50' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 2, descriptionKey: 'bonus.global_click_100' },
    { count: 200, type: 'GLOBAL_CLICK', multiplier: 2, descriptionKey: 'bonus.global_click_100' },
  ]},
   // Hidden/Unlockable Upgrades
  { id: 'cosmic_synergy', nameKey: 'upgrade.cosmic_synergy.name', totalEffectKey: 'upgrade.cosmic_synergy.total_effect', level: 0, baseCost: 1e7, costMultiplier: 10, effectValue: 0.01, effectType: 'MULTIPLY_SPS', isUnlocked: false, unlockedByAchievementId: 'ach_gen_all', category: 'sps_mult', tierBonuses: [] },
  { id: 'novice_clicker', nameKey: 'upgrade.novice_clicker.name', totalEffectKey: 'upgrade.novice_clicker.total_effect', level: 0, baseCost: 1e6, costMultiplier: 2, effectValue: 0.1, effectType: 'MULTIPLY_CLICK', isUnlocked: false, category: 'click_mult', tierBonuses: [
    { count: 50, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    { count: 100, type: 'GLOBAL_CLICK', multiplier: 1.25, descriptionKey: 'bonus.global_click_25' },
  ]},
  { id: 'idle_acolyte', nameKey: 'upgrade.idle_acolyte.name', totalEffectKey: 'upgrade.idle_acolyte.total_effect', level: 0, baseCost: 5e6, costMultiplier: 2.5, effectValue: 0.1, effectType: 'MULTIPLY_SPS', isUnlocked: false, category: 'sps_mult', tierBonuses: [
    { count: 50, type: 'GLOBAL_CLICK', multiplier: 1.1, descriptionKey: 'bonus.global_click_10' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
  ]}
];