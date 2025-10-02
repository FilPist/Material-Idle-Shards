import { FixedBossData } from '../types';

export const FIXED_BOSSES: FixedBossData[] = [
    {
        id: 'guardian_1',
        nameKey: 'boss.fixed.guardian_1.name',
        hp: 1e8,
        reward: 5e7,
        unlockCondition: { type: 'totalShardsEarned', value: 1e9 }
    },
    {
        id: 'guardian_2',
        nameKey: 'boss.fixed.guardian_2.name',
        hp: 1e12,
        reward: 5e11,
        unlockCondition: { type: 'prestigeCount', value: 1 }
    }
];
