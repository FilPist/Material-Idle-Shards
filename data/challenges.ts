import { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  {
    id: 'challenge_clickers_gambit', nameKey: 'challenge.clickers_gambit.name', descriptionKey: 'challenge.clickers_gambit.desc',
    goal: 1e6,
    reward: { type: 'UNLOCK_UPGRADE', descriptionKey: 'challenge.clickers_gambit.reward', payload: { upgradeId: 'novice_clicker' } },
    restrictions: { spsMultiplier: 0 }
  },
  {
    id: 'challenge_patient_observer', nameKey: 'challenge.patient_observer.name', descriptionKey: 'challenge.patient_observer.desc',
    goal: 1e7,
    reward: { type: 'UNLOCK_UPGRADE', descriptionKey: 'challenge.patient_observer.reward', payload: { upgradeId: 'idle_acolyte' } },
    restrictions: { clickMultiplier: 0 }
  },
  {
    id: 'challenge_rapid_growth', nameKey: 'challenge.rapid_growth.name', descriptionKey: 'challenge.rapid_growth.desc',
    goal: 1e20,
    reward: { type: 'PERMANENT_BONUS', descriptionKey: 'challenge.rapid_growth.reward' },
    restrictions: { generatorCostMultiplierFactor: 0.75 }
  },
  {
    id: 'challenge_crit_overload', nameKey: 'challenge.crit_overload.name', descriptionKey: 'challenge.crit_overload.desc',
    goal: 1e12,
    reward: { type: 'PERMANENT_BONUS', descriptionKey: 'challenge.crit_overload.reward' },
    restrictions: { forceCrit: true }
  },
  {
    id: 'challenge_lone_generator', nameKey: 'challenge.lone_generator.name', descriptionKey: 'challenge.lone_generator.desc',
    goal: 1e10,
    reward: { type: 'PERMANENT_BONUS', descriptionKey: 'challenge.lone_generator.reward' },
    restrictions: { loneGenerator: 'gen_0' }
  }
];