import { AscensionUpgrade } from '../types';

export const INITIAL_ASCENSION_UPGRADES: AscensionUpgrade[] = [
  { id: 'ascension_relic_boost', nameKey: 'ascension_upgrade.relic_boost.name', descriptionKey: 'ascension_upgrade.relic_boost.desc', level: 0, maxLevel: 1, cost: 1, effectValue: 3, effectType: 'RELIC_GAIN_MULTIPLIER' },
  { id: 'ascension_prestige_power', nameKey: 'ascension_upgrade.prestige_power.name', descriptionKey: 'ascension_upgrade.prestige_power.desc', level: 0, maxLevel: 5, cost: 2, effectValue: 0.1, effectType: 'PRESTIGE_UPGRADE_POWER' },
  { id: 'ascension_sps_boost', nameKey: 'ascension_upgrade.sps_boost.name', descriptionKey: 'ascension_upgrade.sps_boost.desc', level: 0, maxLevel: 10, cost: 3, effectValue: 1, effectType: 'GLOBAL_SPS_MULTIPLIER' },
];
