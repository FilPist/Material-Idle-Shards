import { Generator } from '../types';

export const INITIAL_GENERATORS: Generator[] = [
  { id: 'gen_0', nameKey: 'generator.shard_dust.name', descriptionKey: 'generator.shard_dust.desc', count: 0, baseCost: 10, costMultiplier: 1.09, baseSps: 0.5, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
    { count: 25, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.05, descriptionKey: 'bonus.global_sps_5' },
    { count: 200, type: 'SELF', multiplier: 5, descriptionKey: 'bonus.x5_prod' },
  ]},
  { id: 'gen_1', nameKey: 'generator.lesser_shard.name', descriptionKey: 'generator.lesser_shard.desc', count: 0, baseCost: 100, costMultiplier: 1.12, baseSps: 1, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
    { count: 25, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 100, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 200, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
  ], specialEffect: { type: 'BONUS_FROM_OTHER_GENERATOR_LEVEL', descriptionKey: 'generator_special_effect.bonus_from_shard_dust', payload: { otherGeneratorId: 'gen_0', bonusPerLevel: 0.01 } },
    evolutions: [{
        milestone: 100,
        choices: [
            { id: 'gen_1_evo_1', nameKey: 'evolution.gen_1.choice_1.name', descriptionKey: 'evolution.gen_1.choice_1.desc', effect: { type: 'OTHER_GEN_SPS_BOOST', value: 0.5, payload: { targetId: 'gen_0' } } },
            { id: 'gen_1_evo_2', nameKey: 'evolution.gen_1.choice_2.name', descriptionKey: 'evolution.gen_1.choice_2.desc', effect: { type: 'SELF_SPS_BOOST', value: 2 } }
        ]
    }]
  },
  { id: 'gen_2', nameKey: 'generator.crystal_outcrop.name', descriptionKey: 'generator.crystal_outcrop.desc', count: 0, baseCost: 1000, costMultiplier: 1.14, baseSps: 5, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
    { count: 25, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.10, descriptionKey: 'bonus.global_sps_10' },
    { count: 200, type: 'SELF', multiplier: 4, descriptionKey: 'bonus.x4_prod' },
  ],
    evolutions: [{
        milestone: 100,
        choices: [
            { id: 'gen_2_evo_1', nameKey: 'evolution.gen_2.choice_1.name', descriptionKey: 'evolution.gen_2.choice_1.desc', effect: { type: 'SPS_TO_CLICK_POWER', value: 0.01 } },
            { id: 'gen_2_evo_2', nameKey: 'evolution.gen_2.choice_2.name', descriptionKey: 'evolution.gen_2.choice_2.desc', effect: { type: 'ADJACENT_SPS_BOOST', value: 0.25 } }
        ]
    }]
  },
  { id: 'gen_3', nameKey: 'generator.energy_geode.name', descriptionKey: 'generator.energy_geode.desc', count: 0, baseCost: 10000, costMultiplier: 1.16, baseSps: 50, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
    { count: 25, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    { count: 200, type: 'SELF', multiplier: 4, descriptionKey: 'bonus.x4_prod' },
  ]},
  { id: 'gen_4', nameKey: 'generator.crystalline_vein.name', descriptionKey: 'generator.crystalline_vein.desc', count: 0, baseCost: 50000, costMultiplier: 1.17, baseSps: 300, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
    { count: 25, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.1, descriptionKey: 'bonus.global_sps_10' },
    { count: 200, type: 'SELF', multiplier: 4, descriptionKey: 'bonus.x4_prod' },
  ]},
  { id: 'gen_5', nameKey: 'generator.shard_monolith.name', descriptionKey: 'generator.shard_monolith.desc', count: 0, baseCost: 500000, costMultiplier: 1.18, baseSps: 2800, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
    { count: 25, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.15, descriptionKey: 'bonus.global_sps_15' },
    { count: 200, type: 'SELF', multiplier: 3, descriptionKey: 'bonus.x3_prod' },
  ]},
  { id: 'gen_6', nameKey: 'generator.shard_forge.name', descriptionKey: 'generator.shard_forge.desc', count: 0, baseCost: 5e6, costMultiplier: 1.20, baseSps: 25000, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
    { count: 25, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
    { count: 100, type: 'GLOBAL_SPS', multiplier: 1.2, descriptionKey: 'bonus.global_sps_20' },
    { count: 200, type: 'SELF', multiplier: 3, descriptionKey: 'bonus.x3_prod' },
  ]},
  { id: 'gen_7', nameKey: 'generator.quantum_entangler.name', descriptionKey: 'generator.quantum_entangler.desc', count: 0, baseCost: 5e7, costMultiplier: 1.22, baseSps: 220000, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
     { count: 25, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
     { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
     { count: 100, type: 'GLOBAL_SPS', multiplier: 1.25, descriptionKey: 'bonus.global_sps_25' },
     { count: 200, type: 'SELF', multiplier: 3, descriptionKey: 'bonus.x3_prod' },
  ], specialEffect: { type: 'BONUS_PER_GENERATOR_TYPE', descriptionKey: 'generator_special_effect.bonus_per_generator_type' } },
  { id: 'gen_8', nameKey: 'generator.reality_weaver.name', descriptionKey: 'generator.reality_weaver.desc', count: 0, baseCost: 5e8, costMultiplier: 1.25, baseSps: 2000000, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
     { count: 25, type: 'GLOBAL_SPS', multiplier: 1.5, descriptionKey: 'bonus.global_sps_50' },
     { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
     { count: 100, type: 'GLOBAL_SPS', multiplier: 2, descriptionKey: 'bonus.global_sps_100' },
     { count: 200, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
  ]},
  { id: 'gen_9', nameKey: 'generator.astral_nexus.name', descriptionKey: 'generator.astral_nexus.desc', count: 0, baseCost: 5e9, costMultiplier: 1.26, baseSps: 2e7, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
     { count: 25, type: 'GLOBAL_SPS', multiplier: 1.5, descriptionKey: 'bonus.global_sps_50' },
     { count: 50, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
     { count: 100, type: 'GLOBAL_SPS', multiplier: 2, descriptionKey: 'bonus.global_sps_100' },
     { count: 200, type: 'SELF', multiplier: 2, descriptionKey: 'bonus.x2_prod' },
  ]},
  { id: 'gen_10', nameKey: 'generator.singularity_fabricator.name', descriptionKey: 'generator.singularity_fabricator.desc', count: 0, baseCost: 5e11, costMultiplier: 1.28, baseSps: 1.5e8, evolutionChoiceId: null, evolutionChoiceId2: null, tierBonuses: [
     { count: 25, type: 'GLOBAL_SPS', multiplier: 2, descriptionKey: 'bonus.global_sps_100' },
     { count: 50, type: 'SELF', multiplier: 3, descriptionKey: 'bonus.x3_prod' },
     { count: 100, type: 'GLOBAL_SPS', multiplier: 3, descriptionKey: 'bonus.x3_prod' },
     { count: 200, type: 'GLOBAL_SPS', multiplier: 5, descriptionKey: 'bonus.x5_prod' },
  ]},
];