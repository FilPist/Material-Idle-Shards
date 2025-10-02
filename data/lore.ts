import { LoreEntry } from '../types';

export const LORE_ENTRIES: LoreEntry[] = [
  {
    id: 'lore_1', titleKey: 'lore.1.title', textKey: 'lore.1.text',
    condition: { type: 'prestigeCount', value: 1 }
  },
  {
    id: 'lore_2', titleKey: 'lore.2.title', textKey: 'lore.2.text',
    condition: { type: 'totalShardsEarned', value: 1e12 }
  },
  {
    id: 'lore_3', titleKey: 'lore.3.title', textKey: 'lore.3.text',
    condition: { type: 'bossDefeats', value: 10 }
  },
  {
    id: 'lore_4', titleKey: 'lore.4.title', textKey: 'lore.4.text',
    condition: { type: 'generatorCount', value: 1, generatorId: 'gen_8' }
  },
];
