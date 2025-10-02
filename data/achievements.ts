import { Achievement } from '../types';
import { INITIAL_GENERATORS } from './generators';
import { INITIAL_TALISMANS } from './talismans';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
    { 
        id: 'ach_shards_1', nameKey: 'ach.shards_1.name', descriptionKey: 'ach.shards_1.desc', isUnlocked: false, 
        condition: { type: 'totalShardsEarned', value: 1000 },
        bonus: { type: 'BASE_CLICK_BONUS', value: 1, descriptionKey: 'ach.bonus.base_click_1' }
    },
    { 
        id: 'ach_clicks_1', nameKey: 'ach.clicks_1.name', descriptionKey: 'ach.clicks_1.desc', isUnlocked: false, 
        condition: { type: 'totalClicks', value: 500 },
        bonus: { type: 'GLOBAL_CLICK_MULTIPLIER', value: 0.05, descriptionKey: 'ach.bonus.click_5' }
    },
    { 
        id: 'ach_gen_1', nameKey: 'ach.gen_1.name', descriptionKey: 'ach.gen_1.desc', isUnlocked: false, 
        condition: { type: 'generatorCount', value: 50, generatorId: 'gen_1' },
        bonus: { type: 'GLOBAL_SPS_MULTIPLIER', value: 0.05, descriptionKey: 'ach.bonus.sps_5' }
    },
    { 
        id: 'ach_shards_2', nameKey: 'ach.shards_2.name', descriptionKey: 'ach.shards_2.desc', isUnlocked: false, 
        condition: { type: 'totalShardsEarned', value: 1e6 },
        bonus: { type: 'CRIT_DAMAGE_BONUS', value: 0.1, descriptionKey: 'ach.bonus.crit_dmg_10' }
    },
    { 
        id: 'ach_clicks_2', nameKey: 'ach.clicks_2.name', descriptionKey: 'ach.clicks_2.desc', isUnlocked: false, 
        condition: { type: 'totalClicks', value: 5000 },
        bonus: { type: 'BASE_CLICK_BONUS', value: 5, descriptionKey: 'ach.bonus.base_click_5' }
    },
    {
        id: 'ach_gen_all', nameKey: 'ach.gen_all.name', descriptionKey: 'ach.gen_all.desc', isUnlocked: false,
        condition: { type: 'haveOneOfEachGenerator', value: INITIAL_GENERATORS.length },
        bonus: { type: 'UNLOCK_UPGRADE', value: 1, payload: { upgradeId: 'cosmic_synergy' }, descriptionKey: 'ach.bonus.unlock_cosmic_synergy' }
    },
    { 
        id: 'ach_prestige_1', nameKey: 'ach.prestige_1.name', descriptionKey: 'ach.prestige_1.desc', isUnlocked: false, 
        condition: { type: 'prestigeCount', value: 1 },
        bonus: { type: 'GRANT_RELICS', value: 1, descriptionKey: 'ach.bonus.relics_1' }
    },
    { 
        id: 'ach_boss_1', nameKey: 'ach.boss_1.name', descriptionKey: 'ach.boss_1.desc', isUnlocked: false, 
        condition: { type: 'bossDefeats', value: 10 },
        bonus: { type: 'GLOBAL_SPS_MULTIPLIER', value: 0.1, descriptionKey: 'ach.bonus.sps_10' }
    },
    { 
        id: 'ach_shards_3', nameKey: 'ach.shards_3.name', descriptionKey: 'ach.shards_3.desc', isUnlocked: false, 
        condition: { type: 'totalShardsEarned', value: 1e9 },
        bonus: { type: 'GLOBAL_SPS_MULTIPLIER', value: 0.1, descriptionKey: 'ach.bonus.sps_10' }
    },
    { 
        id: 'ach_prestige_5', nameKey: 'ach.prestige_5.name', descriptionKey: 'ach.prestige_5.desc', isUnlocked: false, 
        condition: { type: 'prestigeCount', value: 5 },
        bonus: { type: 'GRANT_RELICS', value: 5, descriptionKey: 'ach.bonus.relics_5' }
    },
    { 
        id: 'ach_clicks_3', nameKey: 'ach.clicks_3.name', descriptionKey: 'ach.clicks_3.desc', isUnlocked: false, 
        condition: { type: 'totalClicks', value: 100000 },
        bonus: { type: 'GLOBAL_CLICK_MULTIPLIER', value: 0.1, descriptionKey: 'ach.bonus.click_10' }
    },
    {
        id: 'ach_ascend_1', nameKey: 'ach.ascend_1.name', descriptionKey: 'ach.ascend_1.desc', isUnlocked: false,
        condition: { type: 'ascensionCount', value: 1 },
        bonus: { type: 'GRANT_RELICS', value: 100, descriptionKey: 'ach.bonus.relics_100' }
    },
    {
        id: 'ach_all_talismans', nameKey: 'ach.all_talismans.name', descriptionKey: 'ach.all_talismans.desc', isUnlocked: false,
        condition: { type: 'talismansCrafted', value: INITIAL_TALISMANS.length },
        bonus: { type: 'GLOBAL_SPS_MULTIPLIER', value: 0.25, descriptionKey: 'ach.bonus.sps_25' }
    },
    {
        id: 'ach_complete_challenge_1', nameKey: 'ach.complete_challenge_1.name', descriptionKey: 'ach.complete_challenge_1.desc', isUnlocked: false,
        condition: { type: 'challengesCompleted', value: 1 },
        bonus: { type: 'GLOBAL_CLICK_MULTIPLIER', value: 0.25, descriptionKey: 'ach.bonus.click_25' }
    },
];