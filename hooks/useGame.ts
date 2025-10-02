import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Upgrade, Generator, FloatingNumber, PanelTab, Achievement, Skill, GoldenShard, ShardBoss, ShardTier, PrestigeUpgrade, ActiveEvent, AscensionUpgrade, Challenge, LoreEntry, FixedBossData, Talisman, MiniShard, AllTimeStats } from '../types';
import { calculateBulkCost, calculateMaxAffordable } from '../utils/calculations';
import { formatNumber } from '../utils/format';
import { INITIAL_UPGRADES, INITIAL_GENERATORS, INITIAL_SKILLS, INITIAL_ACHIEVEMENTS, INITIAL_PRESTIGE_UPGRADES, INITIAL_ASCENSION_UPGRADES, CHALLENGES, LORE_ENTRIES, SAVE_KEY, PRESTIGE_REQ, ASCENSION_REQ_RELICS, BOSS_COOLDOWN_SECONDS, BOSS_TIME_LIMIT_SECONDS, SHARD_TIERS, DIRECT_CLICK_BONUS, FIXED_BOSSES, INITIAL_TALISMANS, BOSS_DUST_REWARD, GOLDEN_SHARD_DUST_REWARD, SINGULARITY_GRID_NODES } from '../data';
import { useLanguage } from '../contexts/LanguageContext';

const INITIAL_ALL_TIME_STATS: AllTimeStats = {
    totalTimePlayed: 0, totalShardsEarned: 0, totalClicks: 0, totalBossDefeats: 0,
    totalPrestiges: 0, totalAscensions: 0, highestSPS: 0, highestSPC: 0
};

export const useGame = () => {
  const { t } = useLanguage();
  // Main State
  const [shards, setShards] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0); // For current run
  const [totalShardsEarned, setTotalShardsEarned] = useState(0); // For current run
  const [totalBossDefeats, setTotalBossDefeats] = useState(0); // For current run
  const [goldenShardsClicked, setGoldenShardsClicked] = useState(0); // For current run
  const [currentRunTime, setCurrentRunTime] = useState(0); // in ms
  const [allTimeStats, setAllTimeStats] = useState<AllTimeStats>(INITIAL_ALL_TIME_STATS);
  
  const [relics, setRelics] = useState(0);
  const [prestigeCount, setPrestigeCount] = useState(0);
  const [singularityEssence, setSingularityEssence] = useState(0);
  const [ascensionCount, setAscensionCount] = useState(0);
  const [cosmicDust, setCosmicDust] = useState(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  const [generators, setGenerators] = useState<Generator[]>(INITIAL_GENERATORS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [prestigeUpgrades, setPrestigeUpgrades] = useState<PrestigeUpgrade[]>(INITIAL_PRESTIGE_UPGRADES);
  const [ascensionUpgrades, setAscensionUpgrades] = useState<AscensionUpgrade[]>(INITIAL_ASCENSION_UPGRADES);
  const [purchasedSingularityNodeIds, setPurchasedSingularityNodeIds] = useState<string[]>(['sg_start']);
  const [talismans, setTalismans] = useState<Talisman[]>(INITIAL_TALISMANS);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>([]);
  
  const [isPaused, setIsPaused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  // UI & Event State
  const [activeTab, setActiveTab] = useState<PanelTab>(PanelTab.Generators);
  const [buyAmount, setBuyAmount] = useState<1 | 10 | 'Max'>(1);
  const [activeTalismanLoadout, setActiveTalismanLoadout] = useState(1);
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);
  const [showAscensionModal, setShowAscensionModal] = useState(false);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [generatorToEvolve, setGeneratorToEvolve] = useState<Generator | null>(null);
  const [evolutionPreviewGenerator, setEvolutionPreviewGenerator] = useState<Generator | null>(null);
  const [challengeToStart, setChallengeToStart] = useState<Challenge | null>(null);
  const [offlineProgress, setOfflineProgress] = useState<{shards: number, time: number} | null>(null);
  const [goldenShard, setGoldenShard] = useState<GoldenShard | null>(null);
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [activeBuffs, setActiveBuffs] = useState<{ [key: string]: { timeLeft: number, multiplier?: number, stacks?: number } }>({});
  const [activeMiniShards, setActiveMiniShards] = useState<MiniShard[]>([]);
  const [currentBoss, setCurrentBoss] = useState<ShardBoss | null>(null);
  const [bossCooldown, setBossCooldown] = useState(0);
  const [bossAnimationState, setBossAnimationState] = useState<'summoning' | 'idle' | 'hit' | 'defeated' | null>(null);
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  
  // Refs
  const clickerRef = useRef<HTMLButtonElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const lastTickTime = useRef<number | null>(null);
  const lastSaveTimeRef = useRef<number | null>(null);
  const autoClickAccumulator = useRef(0);
  const spacebarHeld = useRef(false);
  const stateRef = useRef<any>({});
  const holdSource = useRef<'mouse' | 'spacebar' | null>(null);
  const preChallengeState = useRef<any>(null);
  const lastClickTimestamp = useRef<number>(0);
  
  const togglePause = () => {
    const wasPaused = stateRef.current.isPaused;
    setIsPaused(!wasPaused);
    if (wasPaused) {
        lastTickTime.current = Date.now(); // Reset tick time to prevent jump
    }
  }

  // =================================================================================================
  // == VISUAL EFFECT CREATORS (DOM)
  // =================================================================================================

  const createFloatingVisual = useCallback((
    text: string,
    x: number,
    y: number,
    options: { isCrit?: boolean, isSpecial?: boolean } = {}
  ) => {
    const container = clickerRef.current;
    if (!container) return;

    const el = document.createElement('div');
    el.textContent = text;

    let className = 'floating-number absolute text-3xl font-extrabold drop-shadow-lg';
    if (options.isCrit) {
      className += ' text-yellow-300 crit';
    } else if (options.isSpecial) {
      className += ' text-purple-300';
    } else {
      className += ' text-violet-100';
    }
    el.className = className;

    el.style.top = `${y}px`;
    el.style.left = `${x}px`;

    el.addEventListener('animationend', () => {
      el.remove();
    });

    container.appendChild(el);
  }, []);

  const createParticle = useCallback((x: number, y: number) => {
    const container = clickerRef.current;
    if (!container) return;

    const size = 6 + Math.random() * 8;
    const angle = Math.random() * 360;
    const distance = 50 + Math.random() * 50;
    const finalX = Math.cos(angle * (Math.PI / 180)) * distance;
    const finalY = Math.sin(angle * (Math.PI / 180)) * distance;

    const el = document.createElement('div');
    el.className = 'particle';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.setProperty('--final-x', `${finalX}px`);
    el.style.setProperty('--final-y', `${finalY}px`);

    el.addEventListener('animationend', () => {
      el.remove();
    });

    container.appendChild(el);
  }, []);
  
  // =================================================================================================
  // == CALCULATIONS (MEMOIZED)
  // =================================================================================================
  const achievementBonuses = useMemo(() => {
    const bonuses = {
        spsMultiplier: 1,
        clickMultiplier: 1,
        critDamageBonus: 0,
        baseClickBonus: 0,
    };
    achievements.forEach(ach => {
        if (ach.isUnlocked) {
            switch (ach.bonus.type) {
                case 'GLOBAL_SPS_MULTIPLIER': bonuses.spsMultiplier += ach.bonus.value; break;
                case 'GLOBAL_CLICK_MULTIPLIER': bonuses.clickMultiplier += ach.bonus.value; break;
                case 'CRIT_DAMAGE_BONUS': bonuses.critDamageBonus += ach.bonus.value; break;
                case 'BASE_CLICK_BONUS': bonuses.baseClickBonus += ach.bonus.value; break;
            }
        }
    });
    return bonuses;
  }, [achievements]);

  const ascensionBonuses = useMemo(() => {
    const bonuses = {
        relicGainMultiplier: 1,
        prestigeUpgradePower: 1,
        spsMultiplier: 1,
        clickMultiplier: 1,
    };
    ascensionUpgrades.forEach(au => {
        if (au.level > 0) {
            const totalEffect = au.level * au.effectValue;
            switch(au.effectType) {
                case 'RELIC_GAIN_MULTIPLIER': bonuses.relicGainMultiplier *= totalEffect; break;
                case 'PRESTIGE_UPGRADE_POWER': bonuses.prestigeUpgradePower += totalEffect; break;
                case 'GLOBAL_SPS_MULTIPLIER': bonuses.spsMultiplier += totalEffect; break;
                case 'GLOBAL_CLICK_MULTIPLIER': bonuses.clickMultiplier += totalEffect; break;
            }
        }
    });
    return bonuses;
  }, [ascensionUpgrades]);

  const singularityGridBonuses = useMemo(() => {
    const bonuses = {
      spsMultiplier: 1,
      clickMultiplier: 1,
      freeGeneratorLevels: 0,
      shardlingCritLink: 0,
    };
    purchasedSingularityNodeIds.forEach(nodeId => {
      const node = SINGULARITY_GRID_NODES.find(n => n.id === nodeId);
      if (node) {
        switch (node.effect.type) {
          case 'PERMANENT_SPS_MULTIPLIER': bonuses.spsMultiplier += (node.effect.value - 1); break;
          case 'PERMANENT_CLICK_MULTIPLIER': bonuses.clickMultiplier += (node.effect.value - 1); break;
          case 'FREE_GENERATOR_LEVELS': bonuses.freeGeneratorLevels += node.effect.value; break;
          case 'SHARDLING_CRIT_LINK': bonuses.shardlingCritLink += node.effect.value; break;
        }
      }
    });
    return bonuses;
  }, [purchasedSingularityNodeIds]);

  const prestigeBonuses = useMemo(() => {
    const bonuses = {
        spsMultiplier: 1,
        clickMultiplier: 1,
        critDamageBonus: 0,
        startingShards: 0,
        relicGainMultiplier: 1,
        talismanSlots: 1,
        goldenShardRewardMultiplier: 1,
        bossCooldownReduction: 0,
        spsToClickConversion: 0,
        baseGeneratorSpsMultiplier: 1,
    };
    prestigeUpgrades.forEach(pu => {
        if (pu.level > 0) {
            const totalEffect = pu.level * pu.effectValue * ascensionBonuses.prestigeUpgradePower;
            switch(pu.effectType) {
                case 'GLOBAL_SPS_MULTIPLIER': bonuses.spsMultiplier += totalEffect; break;
                case 'GLOBAL_CLICK_MULTIPLIER': bonuses.clickMultiplier += totalEffect; break;
                case 'CRIT_DAMAGE_BONUS': bonuses.critDamageBonus += totalEffect; break;
                case 'STARTING_SHARDS': bonuses.startingShards += totalEffect; break;
                case 'RELIC_GAIN_MULTIPLIER': bonuses.relicGainMultiplier += totalEffect; break;
                case 'TALISMAN_SLOTS': bonuses.talismanSlots += totalEffect; break;
                case 'GOLDEN_SHARD_REWARD_MULTIPLIER': bonuses.goldenShardRewardMultiplier += totalEffect; break;
                case 'BOSS_COOLDOWN_REDUCTION': bonuses.bossCooldownReduction += totalEffect; break;
                case 'SPS_TO_CLICK_CONVERSION': bonuses.spsToClickConversion += totalEffect; break;
                case 'BASE_GENERATOR_SPS_MULTIPLIER': bonuses.baseGeneratorSpsMultiplier += totalEffect; break;
            }
        }
    });
    return bonuses;
  }, [prestigeUpgrades, ascensionBonuses.prestigeUpgradePower]);

  const talismanBonuses = useMemo(() => {
    const equippedTalismans = talismans.filter(t => t.isCrafted && t.equippedInLoadouts.includes(activeTalismanLoadout));

    const bonuses = {
        critChance: 0,
        critDamage: 0,
        goldenShardMultiplier: 1,
        offlineMultiplier: 0.5, // Base offline rate is 50%
        spsPerRelic: 0,
        shardlingSpsMultiplier: 1,
        bossDustMultiplier: 1,
        relicOnClickChance: 0,
        autoCollectGoldenShard: 0,
        isHoarderActive: false,
        isMomentumActive: false,
    };

    for (const talisman of equippedTalismans) {
        if (talisman.level === 0) continue;
        const totalEffect = talisman.effect.value * talisman.level;
        const totalSecondaryEffect = (talisman.effect.secondaryValue ?? 0) * talisman.level;

        switch (talisman.effect.type) {
            case 'CRIT_BOOST':
                bonuses.critChance += totalEffect;
                bonuses.critDamage += totalSecondaryEffect;
                break;
            case 'GOLDEN_SHARD_BOOST': bonuses.goldenShardMultiplier *= (1 + totalEffect); break;
            case 'OFFLINE_SPS_BOOST': if (talisman.level > 0) bonuses.offlineMultiplier = 1.0; break;
            case 'IDLE_SPS_BOOST_PER_RELIC': bonuses.spsPerRelic += totalEffect; break;
            case 'SHARDLING_SPS_BOOST': bonuses.shardlingSpsMultiplier *= (1 + totalEffect); break;
            case 'BOSS_DUST_MULTIPLIER': bonuses.bossDustMultiplier *= (1 + totalEffect); break;
            case 'RELIC_ON_CLICK_CHANCE': bonuses.relicOnClickChance += totalEffect; break;
            case 'AUTO_COLLECT_GOLDEN_SHARD': bonuses.autoCollectGoldenShard = totalEffect; break;
            case 'SHARD_CAP_SPS_BOOST': bonuses.isHoarderActive = true; break;
            case 'MOMENTUM_CLICK_BOOST': bonuses.isMomentumActive = true; break;
        }
    }
    return bonuses;
  }, [talismans, activeTalismanLoadout]);

   const challengeBonuses = useMemo(() => {
    const bonuses = {
        generatorCostReduction: 1,
        baseCritChanceBonus: 0,
        permanentGeneratorBoosts: {} as {[key: string]: number},
    };
    if (completedChallengeIds.includes('challenge_rapid_growth')) {
        bonuses.generatorCostReduction = 0.9; // 10% reduction
    }
    if (completedChallengeIds.includes('challenge_crit_overload')) {
        bonuses.baseCritChanceBonus = 0.01; // +1% base crit chance
    }
    if (completedChallengeIds.includes('challenge_lone_generator')) {
        bonuses.permanentGeneratorBoosts['gen_0'] = 2; // gen_0 is 2x stronger
    }
    return bonuses;
  }, [completedChallengeIds]);

  const challengeModifiers = useMemo(() => {
    const modifiers = {
      disabledUpgradeCategories: [] as string[],
      spsMultiplier: 1,
      clickMultiplier: 1,
    };
    
    if (activeChallengeId) {
        const challenge = CHALLENGES.find(c => c.id === activeChallengeId);
        if (challenge) {
            modifiers.disabledUpgradeCategories = challenge.restrictions.disabledUpgradeCategories ?? [];
            modifiers.spsMultiplier = challenge.restrictions.spsMultiplier ?? 1;
            modifiers.clickMultiplier = challenge.restrictions.clickMultiplier ?? 1;
        }
    }

    return modifiers;
  }, [activeChallengeId, completedChallengeIds]);

  const currentShardTier = useMemo(() => {
    let tier = SHARD_TIERS[0];
    let tierIndex = 0;
    for (let i = SHARD_TIERS.length - 1; i >= 0; i--) {
        if(prestigeCount >= SHARD_TIERS[i].prestigeRequired) {
            tier = SHARD_TIERS[i];
            tierIndex = i;
            break;
        }
    }
    return { ...tier, index: tierIndex };
  }, [prestigeCount]);

  const { critChance, critDamage } = useMemo(() => {
      const activeChallenge = CHALLENGES.find(c => c.id === activeChallengeId);
      if (activeChallenge?.restrictions.forceCrit) {
        return { critChance: 1, critDamage: 1.5 };
      }
      const isCritSkillActive = skills.find(s => s.id === 'skill_critical_surge')?.isActive ?? false;
      const isClickFrenzyActive = activeBuffs['click_frenzy'];
      const baseChance = upgrades.filter(u => u.effectType === 'CRIT_CHANCE' && !challengeModifiers.disabledUpgradeCategories.includes(u.category)).reduce((acc, u) => acc + u.level * u.effectValue, 0) + talismanBonuses.critChance + challengeBonuses.baseCritChanceBonus;
      let damage = 1.5 + upgrades.filter(u => u.effectType === 'CRIT_DAMAGE' && !challengeModifiers.disabledUpgradeCategories.includes(u.category)).reduce((acc, u) => acc + u.level * u.effectValue, 0) + achievementBonuses.critDamageBonus + prestigeBonuses.critDamageBonus + talismanBonuses.critDamage;
      if(currentShardTier.bonus.type === 'CRIT_DAMAGE_BOOST') {
        damage += currentShardTier.bonus.value;
      }
      return { critChance: isCritSkillActive || isClickFrenzyActive ? 1 : Math.min(baseChance, 1), critDamage: damage };
  }, [upgrades, skills, currentShardTier, achievementBonuses, prestigeBonuses, challengeModifiers.disabledUpgradeCategories, talismanBonuses, activeBuffs, activeChallengeId, challengeBonuses.baseCritChanceBonus]);
  
  const { clickAdd, spsMultiplier } = useMemo(() => {
    return {
        clickAdd: 1 + upgrades.filter(u => u.effectType === 'ADD' && u.isUnlocked && !challengeModifiers.disabledUpgradeCategories.includes(u.category)).reduce((acc, u) => acc + u.level * u.effectValue, 0) + achievementBonuses.baseClickBonus,
        spsMultiplier: upgrades.filter(u => u.effectType === 'MULTIPLY_SPS' && u.isUnlocked && !challengeModifiers.disabledUpgradeCategories.includes(u.category)).reduce((acc, u) => acc + u.level * u.effectValue, 1),
    }
  }, [upgrades, achievementBonuses, challengeModifiers.disabledUpgradeCategories]);

  const bossDamageMultiplier = useMemo(() => {
      const bossSlayerSkill = skills.find(s => s.id === 'skill_boss_slayer');
      const bonus = (bossSlayerSkill?.level ?? 0) * (bossSlayerSkill?.effectValue ?? 0);
      return 1 + bonus;
  }, [skills]);

  const { shardsPerClick, totalSPS, generatorOutputs } = useMemo(() => {
    const activeChallenge = CHALLENGES.find(c => c.id === activeChallengeId);
    const eventMultiplier = activeEvent ? activeEvent.multiplier : 1;
    const storedPowerMultiplier = activeBuffs.stored_power?.multiplier ?? 1;

    let globalTierBonus = 1;
    if(currentShardTier.bonus.type === 'GLOBAL_MULTIPLIER') {
        globalTierBonus = currentShardTier.bonus.value;
    }
    
    const overdriveSkill = skills.find(s => s.id === 'skill_gen_overdrive');
    const overdriveMultiplier = (overdriveSkill?.isActive) ? 5 : 1;

    let globalClickTierMultiplier = 1;
    let globalSpsTierMultiplier = 1;
    const selfTierMultipliers: {[key: string]: number} = {};

    upgrades.forEach(upg => upg.tierBonuses?.forEach(b => {
        if (upg.level >= b.count) {
            if(b.type === 'GLOBAL_CLICK') globalClickTierMultiplier *= b.multiplier;
            else if (b.type === 'GLOBAL_SPS') globalSpsTierMultiplier *= b.multiplier;
        }
    }));
    generators.forEach(gen => {
        selfTierMultipliers[gen.id] = 1;
        gen.tierBonuses.forEach(b => {
            if(gen.count >= b.count) {
                if(b.type === 'SELF') selfTierMultipliers[gen.id] *= b.multiplier;
                else if(b.type === 'GLOBAL_SPS') globalSpsTierMultiplier *= b.multiplier;
            }
        });
    });

    const clickMultiplier = upgrades.filter(u => u.effectType === 'MULTIPLY_CLICK' && u.isUnlocked && !challengeModifiers.disabledUpgradeCategories.includes(u.category)).reduce((acc, u) => acc + u.level * u.effectValue, 1) * achievementBonuses.clickMultiplier * prestigeBonuses.clickMultiplier * ascensionBonuses.clickMultiplier * singularityGridBonuses.clickMultiplier * challengeModifiers.clickMultiplier;
    
    const spsPerRelicBonus = 1 + (relics * talismanBonuses.spsPerRelic);

    let hoarderBonus = 1;
    if (talismanBonuses.isHoarderActive) {
      const spsOneMinute = stateRef.current.totalSPS * 60;
      if (shards > spsOneMinute * 0.9) {
          hoarderBonus = 3;
      }
    }

    const finalSpsMultiplier = spsMultiplier * globalTierBonus * globalSpsTierMultiplier * eventMultiplier * achievementBonuses.spsMultiplier * prestigeBonuses.spsMultiplier * ascensionBonuses.spsMultiplier * singularityGridBonuses.spsMultiplier * challengeModifiers.spsMultiplier * overdriveMultiplier * spsPerRelicBonus * storedPowerMultiplier * hoarderBonus;
    
    // Generator Special & Evolution Effects pre-calculation
    const generatorBonuses: {[key: string]: {spsMult: number, spsToClick: number}} = {};
    generators.forEach(g => { generatorBonuses[g.id] = {spsMult: 1, spsToClick: 0}});
    const ownedGeneratorTypes = generators.filter(g => g.count > 0).length;

    generators.forEach((gen, index) => {
        // Special effects
        if (gen.specialEffect?.type === 'BONUS_PER_GENERATOR_TYPE') {
            generatorBonuses[gen.id].spsMult *= (1 + ownedGeneratorTypes * 0.05);
        }
        if (gen.specialEffect?.type === 'BONUS_FROM_OTHER_GENERATOR_LEVEL' && gen.specialEffect.payload) {
            const otherGen = generators.find(g => g.id === gen.specialEffect!.payload!.otherGeneratorId);
            if (otherGen) {
                 generatorBonuses[gen.id].spsMult *= (1 + otherGen.count * gen.specialEffect.payload.bonusPerLevel!);
            }
        }
        // Evolution effects
        const evolutionChoicesToApply = [gen.evolutionChoiceId, gen.evolutionChoiceId2].filter(Boolean);
        evolutionChoicesToApply.forEach(choiceId => {
            const evolution = gen.evolutions?.[0].choices.find(c => c.id === choiceId);
             if (evolution) {
                switch(evolution.effect.type) {
                    case 'SELF_SPS_BOOST': generatorBonuses[gen.id].spsMult *= evolution.effect.value; break;
                    case 'OTHER_GEN_SPS_BOOST': 
                        if (evolution.effect.payload?.targetId) generatorBonuses[evolution.effect.payload.targetId].spsMult *= (1 + evolution.effect.value);
                        break;
                    case 'ADJACENT_SPS_BOOST':
                        if (index > 0) generatorBonuses[generators[index-1].id].spsMult *= (1 + evolution.effect.value);
                        if (index < generators.length - 1) generatorBonuses[generators[index+1].id].spsMult *= (1 + evolution.effect.value);
                        break;
                    case 'SPS_TO_CLICK_POWER': generatorBonuses[gen.id].spsToClick += evolution.effect.value; break;
                }
            }
        })
    });

    const outputs: { [key: string]: number } = {};
    let spsToClickPowerBonus = 0;
    generators.forEach(gen => {
        if (activeChallenge?.restrictions.loneGenerator && gen.id !== activeChallenge.restrictions.loneGenerator) {
            outputs[gen.id] = 0;
            return;
        }
        const permBoost = challengeBonuses.permanentGeneratorBoosts[gen.id] ?? 1;
        const singleGeneratorSps = gen.baseSps * prestigeBonuses.baseGeneratorSpsMultiplier * permBoost * selfTierMultipliers[gen.id] * generatorBonuses[gen.id].spsMult;
        const totalOutputForGen = gen.count * singleGeneratorSps;
        if(generatorBonuses[gen.id].spsToClick > 0) {
            spsToClickPowerBonus += totalOutputForGen * finalSpsMultiplier * generatorBonuses[gen.id].spsToClick;
        }
        outputs[gen.id] = totalOutputForGen * finalSpsMultiplier;
    });
    
    // This is the generator-only SPS, used for conversion effects to avoid circular dependencies
    const generatorOnlySps = Object.values(outputs).reduce((a, b) => a + b, 0);

    // Kinetic Conversion calculation (SPS -> Click Power)
    const kineticConversionUpgrade = upgrades.find(u => u.id === 'kinetic_conversion');
    const kineticConversionEffect = (kineticConversionUpgrade?.level ?? 0) * (kineticConversionUpgrade?.effectValue ?? 0);
    const kineticBonus = generatorOnlySps * (kineticConversionEffect + prestigeBonuses.spsToClickConversion);

    let finalClickAdd = clickAdd;
    if (activeChallenge?.restrictions.forceCrit) {
        finalClickAdd = 1;
    }

    const momentumMultiplier = activeBuffs.momentum?.multiplier ?? 1;
    let finalShardsPerClick = (finalClickAdd + spsToClickPowerBonus + kineticBonus) * clickMultiplier * globalTierBonus * eventMultiplier * globalClickTierMultiplier * momentumMultiplier;
    
    const shardlingCount = skills.find(s => s.id === 'skill_shardling_conjure')?.level ?? 0;
    let finalShardlingSPS = 0;
    if (shardlingCount > 0) {
        const clicksPerSecond = shardlingCount * 1; // 1 click per second per shardling
        const shardlingCritDamage = 1 + (critDamage - 1) * singularityGridBonuses.shardlingCritLink;
        const avgDamagePerClick = finalShardsPerClick * (1 - critChance) + finalShardsPerClick * critChance * shardlingCritDamage;
        finalShardlingSPS = avgDamagePerClick * clicksPerSecond * eventMultiplier * talismanBonuses.shardlingSpsMultiplier;
    }

    let calculatedSps = generatorOnlySps + finalShardlingSPS;
    if (activeChallenge?.id === 'challenge_patient_observer') {
        calculatedSps += 1; // Add a base of 1 SPS to make the challenge possible.
    }

    return { shardsPerClick: finalShardsPerClick, totalSPS: calculatedSps, generatorOutputs: outputs };
  }, [upgrades, generators, skills, critChance, critDamage, clickAdd, spsMultiplier, achievementBonuses, prestigeBonuses, currentShardTier, activeEvent, ascensionBonuses, challengeModifiers, completedChallengeIds, relics, talismanBonuses, activeBuffs, activeChallengeId, challengeBonuses, singularityGridBonuses, shards, activeTalismanLoadout]);

  const upgradeTotalEffects = useMemo(() => {
    const effects: { [key: string]: number } = {};
    upgrades.forEach(u => {
      effects[u.id] = u.level * u.effectValue;
    });
    skills.forEach(s => {
      if(s.effectValue) effects[s.id] = s.level * s.effectValue;
    });
    return effects;
  }, [upgrades, skills]);

  const { relicsOnPrestige, canPrestige } = useMemo(() => {
    const canDoPrestige = shards >= PRESTIGE_REQ && !activeChallengeId;
    let calculatedRelics = canDoPrestige ? Math.floor(5 * Math.pow(shards / PRESTIGE_REQ, 0.25)) : 0;
    calculatedRelics *= (prestigeBonuses.relicGainMultiplier * ascensionBonuses.relicGainMultiplier);
    return { relicsOnPrestige: calculatedRelics, canPrestige: canDoPrestige };
  }, [shards, prestigeBonuses.relicGainMultiplier, ascensionBonuses.relicGainMultiplier, activeChallengeId]);

  const { essenceOnAscension, canAscend } = useMemo(() => {
    const canDoAscension = relics >= ASCENSION_REQ_RELICS;
    const essence = canDoAscension ? Math.floor(Math.pow(relics / ASCENSION_REQ_RELICS, 0.5)) : 0;
    return { essenceOnAscension: essence, canAscend: canDoAscension };
  }, [relics]);
  
  const availableFixedBosses = useMemo(() => {
    return FIXED_BOSSES.filter(boss => {
        if (boss.unlockCondition.type === 'totalShardsEarned') {
            return totalShardsEarned >= boss.unlockCondition.value;
        }
        if (boss.unlockCondition.type === 'prestigeCount') {
            return prestigeCount >= boss.unlockCondition.value;
        }
        return false;
    });
  }, [totalShardsEarned, prestigeCount]);

  const isOmniClickUnlocked = useMemo(() => (skills.find(s => s.id === 'skill_omni_click')?.level ?? 0) > 0, [skills]);
  const furiousClickingSkill = useMemo(() => skills.find(s => s.id === 'skill_furious_clicking'), [skills]);

  // =================================================================================================
  // == GAME ACTIONS & HANDLERS
  // =================================================================================================
  const gainShards = useCallback((amount: number) => {
    if (amount > 0) {
        setShards(s => s + amount);
        setTotalShardsEarned(t => t + amount);
        setAllTimeStats(s => ({...s, totalShardsEarned: s.totalShardsEarned + amount}));
    }
  }, []);

  const handleBossDamage = useCallback((damage: number) => {
    setCurrentBoss(boss => {
        if (!boss || stateRef.current.bossAnimationState === 'defeated') return boss;
        const finalDamage = damage * stateRef.current.bossDamageMultiplier;
        const newHp = boss.currentHp - finalDamage;
        if (newHp <= 0) {
            setBossAnimationState('defeated');
            setTimeout(() => {
              const dustReward = BOSS_DUST_REWARD * stateRef.current.talismanBonuses.bossDustMultiplier;
              gainShards(boss.reward);
              setCosmicDust(d => d + dustReward);
              setTotalBossDefeats(d => d + 1);
              setAllTimeStats(s => ({...s, totalBossDefeats: s.totalBossDefeats + 1}));
              setBossCooldown(BOSS_COOLDOWN_SECONDS * (1 - stateRef.current.prestigeBonuses.bossCooldownReduction));
              if(gameAreaRef.current) {
                  const rect = gameAreaRef.current.getBoundingClientRect();
                  createFloatingVisual(t('boss.reward', { reward: formatNumber(boss.reward) }), rect.width / 2, rect.height / 2, { isSpecial: true });
                  createFloatingVisual(`+${dustReward} Dust`, rect.width / 2, rect.height / 2 + 40, { isSpecial: true });
              }
              setCurrentBoss(null);
              setBossAnimationState(null);
            }, 800);
            return { ...boss, currentHp: 0 };
        }
        return { ...boss, currentHp: newHp };
    });
  }, [t, gainShards, createFloatingVisual]);

  const spawnGoldenShard = useCallback(() => {
    if (!stateRef.current.goldenShard) {
      setGoldenShard({ id: Date.now(), x: 20 + Math.random() * 60, y: 20 + Math.random() * 60, createdAt: Date.now(), lifetime: 10000 });
    }
  }, []);

  const executeClick = useCallback((clientX?: number, clientY?: number, isDirect: boolean = false) => {
    const { shardsPerClick, critChance, critDamage, currentBoss, currentShardTier, isOmniClickUnlocked, talismanBonuses } = stateRef.current;
    
    let clickerElem = clickerRef.current;
    if (!clickerElem) return;

    const rect = clickerElem.getBoundingClientRect();
    const finalX = clientX ? clientX - rect.left : rect.width * (0.4 + Math.random() * 0.2);
    const finalY = clientY ? clientY - rect.top : rect.height * (0.4 + Math.random() * 0.2);

    const isCrit = Math.random() < critChance;
    
    let directClickMultiplier = 1;
    if (isDirect && isOmniClickUnlocked) {
        directClickMultiplier = DIRECT_CLICK_BONUS;
    }
    let amount = shardsPerClick * directClickMultiplier;

    if (isCrit) amount *= critDamage;

    createFloatingVisual(`+${formatNumber(amount)}`, finalX, finalY, { isCrit });

    if (currentBoss) {
        handleBossDamage(amount);
        setBossAnimationState('hit');
        setTimeout(() => setBossAnimationState('idle'), 150);
    } else {
        gainShards(amount);
    }
    
    if (Math.random() < talismanBonuses.relicOnClickChance) {
        setRelics(r => r + 1);
        createFloatingVisual(`+1 Relic!`, finalX, finalY - 30, { isSpecial: true });
    }

    if (currentShardTier.bonus.type === 'GOLDEN_SHARD_CHANCE' && Math.random() < (currentShardTier.bonus.value * talismanBonuses.goldenShardMultiplier)) {
      spawnGoldenShard();
    }
    
    if (currentShardTier.index >= 3) {
      for (let i = 0; i < 3; i++) {
        createParticle(finalX, finalY);
      }
    }

    setTotalClicks(c => c + 1);
    setAllTimeStats(s => ({...s, totalClicks: s.totalClicks + 1}));
    lastClickTimestamp.current = Date.now();
  }, [gainShards, createFloatingVisual, createParticle, handleBossDamage, spawnGoldenShard]);

  const handleBuy = (type: 'upgrade' | 'generator' | 'skill', id: string, freeLevels: number = 0) => {
    const { challengeBonuses, activeChallengeId } = stateRef.current;
    const activeChallenge = CHALLENGES.find(c => c.id === activeChallengeId);
    
    if (type === 'upgrade') {
        const upgrade = upgrades.find(u => u.id === id);
        if (!upgrade) return;
        const maxLevel = upgrade.maxLevel ?? Infinity;
        if (upgrade.level >= maxLevel) return;

        let amountToBuy = freeLevels > 0 ? freeLevels : (buyAmount === 'Max' ? calculateMaxAffordable(upgrade.baseCost, upgrade.costMultiplier, upgrade.level, shards) : buyAmount);
        if (upgrade.level + amountToBuy > maxLevel) amountToBuy = maxLevel - upgrade.level;
        if (amountToBuy <= 0) return;

        const cost = freeLevels > 0 ? 0 : calculateBulkCost(upgrade.baseCost, upgrade.costMultiplier, upgrade.level, amountToBuy);
        if (shards >= cost) { setShards(s => s - cost); setUpgrades(upgrades.map(u => u.id === id ? { ...u, level: u.level + amountToBuy } : u)); }

    } else if (type === 'generator') {
        const generator = generators.find(g => g.id === id);
        if (!generator) return;
        
        const costReduction = challengeBonuses.generatorCostReduction;
        const currentCostMultiplier = activeChallenge?.restrictions.generatorCostMultiplierFactor 
            ? 1 + (generator.costMultiplier - 1) * activeChallenge.restrictions.generatorCostMultiplierFactor
            : generator.costMultiplier;

        const amountToBuy = buyAmount === 'Max' ? calculateMaxAffordable(generator.baseCost * costReduction, currentCostMultiplier, generator.count, shards) : buyAmount;
        if (amountToBuy <= 0) return;
        const cost = calculateBulkCost(generator.baseCost * costReduction, currentCostMultiplier, generator.count, amountToBuy);
        if (shards >= cost) { 
            setShards(s => s - cost); 
            setGenerators(gens => {
                let newGens = gens.map(g => g.id === id ? { ...g, count: g.count + amountToBuy } : g);
                const targetGen = newGens.find(g => g.id === id);
                if (targetGen && targetGen.count >= 200 && targetGen.evolutions?.[0] && targetGen.evolutionChoiceId && !targetGen.evolutionChoiceId2) {
                    const otherChoice = targetGen.evolutions[0].choices.find(c => c.id !== targetGen.evolutionChoiceId);
                    if (otherChoice) {
                        newGens = newGens.map(g => g.id === id ? { ...g, evolutionChoiceId2: otherChoice.id } : g);
                    }
                }
                return newGens;
            });
        }
    
    } else { // Skill
        const skill = skills.find(s => s.id === id);
        if (!skill) return;
        const maxLevel = skill.maxLevel ?? Infinity;
        if (skill.level >= maxLevel) return;

        let amountToBuy = (skill.costMultiplier && buyAmount === 'Max') ? calculateMaxAffordable(skill.baseCost, skill.costMultiplier, skill.level, shards) : (buyAmount === 'Max' ? (shards >= skill.baseCost ? 1 : 0) : buyAmount);
        if (skill.level + amountToBuy > maxLevel) amountToBuy = maxLevel - skill.level;
        if (amountToBuy <= 0) return;

        const cost = calculateBulkCost(skill.baseCost, skill.costMultiplier ?? 1, skill.level, amountToBuy);
        if (shards >= cost) { setShards(s => s - cost); setSkills(skills.map(s => s.id === id ? { ...s, level: s.level + amountToBuy } : s)); }
    }
  };

  const handleBuyPrestigeUpgrade = (id: string) => {
      const upgrade = prestigeUpgrades.find(pu => pu.id === id);
      if (!upgrade || upgrade.level >= upgrade.maxLevel || relics < upgrade.cost) return;

      setRelics(r => r - upgrade.cost);
      setPrestigeUpgrades(current => current.map(pu => pu.id === id ? {...pu, level: pu.level + 1} : pu));
  };
  
  const handleBuyAscensionUpgrade = (id: string) => {
    const upgrade = ascensionUpgrades.find(au => au.id === id);
    if (!upgrade || upgrade.level >= upgrade.maxLevel || singularityEssence < upgrade.cost) return;

    setSingularityEssence(se => se - upgrade.cost);
    setAscensionUpgrades(current => current.map(au => au.id === id ? { ...au, level: au.level + 1 } : au));
  };

  const handleBuySingularityNode = (id: string) => {
    const node = SINGULARITY_GRID_NODES.find(n => n.id === id);
    if (!node || purchasedSingularityNodeIds.includes(id) || singularityEssence < node.cost) return;
    if (!node.prerequisites.every(p => purchasedSingularityNodeIds.includes(p))) return;
    
    setSingularityEssence(se => se - node.cost);
    setPurchasedSingularityNodeIds(ids => [...ids, id]);
  };

  const handleCraftTalisman = (id: string) => {
    const talisman = talismans.find(t => t.id === id);
    if (!talisman || talisman.isCrafted || cosmicDust < talisman.cost) return;

    setCosmicDust(d => d - talisman.cost);
    setTalismans(current => current.map(t => t.id === id ? { ...t, isCrafted: true, level: t.level === 0 ? 1 : t.level } : t));
  };

  const handleUpgradeTalisman = (id: string) => {
    const talisman = talismans.find(t => t.id === id);
    if (!talisman || !talisman.isCrafted || talisman.level >= talisman.maxLevel) return;

    const cost = Math.floor(talisman.cost * Math.pow(talisman.costMultiplier, talisman.level));
    if (cosmicDust >= cost) {
        setCosmicDust(d => d - cost);
        setTalismans(current => current.map(t => t.id === id ? { ...t, level: t.level + 1 } : t));
    }
  };

  const handleEquipTalisman = (id: string) => {
    const talisman = talismans.find(t => t.id === id);
    if (!talisman || !talisman.isCrafted) return;
    
    const isEquipped = talisman.equippedInLoadouts.includes(activeTalismanLoadout);
    const equippedCount = talismans.filter(t => t.equippedInLoadouts.includes(activeTalismanLoadout)).length;
    const maxSlots = stateRef.current.prestigeBonuses.talismanSlots;

    if (isEquipped) { // Unequip
        setTalismans(current => current.map(t => t.id === id ? { ...t, equippedInLoadouts: t.equippedInLoadouts.filter(l => l !== activeTalismanLoadout) } : t));
    } else if (equippedCount < maxSlots) { // Equip
        setTalismans(current => current.map(t => t.id === id ? { ...t, equippedInLoadouts: [...t.equippedInLoadouts, activeTalismanLoadout] } : t));
    }
  };

  const openEvolutionModal = (generatorId: string) => {
    const gen = stateRef.current.generators.find((g: Generator) => g.id === generatorId);
    if (gen) {
        setGeneratorToEvolve(gen);
        setShowEvolutionModal(true);
    }
  };
  const openEvolutionPreviewModal = (generatorId: string) => {
    const gen = stateRef.current.generators.find((g: Generator) => g.id === generatorId);
    if (gen) {
        setEvolutionPreviewGenerator(gen);
        setShowEvolutionModal(true);
    }
  };
  const closeEvolutionModal = () => {
    setShowEvolutionModal(false);
    setGeneratorToEvolve(null);
    setEvolutionPreviewGenerator(null);
  };
  const handleEvolveGenerator = (generatorId: string, choiceId: string) => {
    setGenerators(gens => gens.map(g => g.id === generatorId ? {...g, evolutionChoiceId: choiceId} : g));
    closeEvolutionModal();
  };

  const resetForPrestige = (isChallengeStart = false) => {
    if (!isChallengeStart) {
      setPrestigeCount(c => c + 1);
      setAllTimeStats(s => ({...s, totalPrestiges: s.totalPrestiges + 1}));
    }
    const freeLevels = stateRef.current.singularityGridBonuses.freeGeneratorLevels;
    setShards(stateRef.current.prestigeBonuses.startingShards);
    setUpgrades(INITIAL_UPGRADES.map(u => ({...u, level: 0, isUnlocked: u.isUnlocked !== false})));
    setGenerators(INITIAL_GENERATORS.map(g => ({...g, count: g.id === 'gen_0' ? freeLevels : 0, evolutionChoiceId: null, evolutionChoiceId2: null})));
    setSkills(INITIAL_SKILLS.map(s => ({...s, level: 0, isActive: false, cooldownRemaining: 0, durationRemaining: 0 })));
    setTotalShardsEarned(0);
    setTotalClicks(0);
    setTotalBossDefeats(0);
    setGoldenShardsClicked(0);
    setCurrentRunTime(0);
  };

  const handlePrestige = () => {
    if (!canPrestige) return;
    setRelics(r => r + relicsOnPrestige);
    resetForPrestige();
    setShowPrestigeModal(false);
  };
  
  const handleAscend = () => {
    if (!canAscend) return;
    setSingularityEssence(se => se + essenceOnAscension);
    setAscensionCount(ac => ac + 1);
    setAllTimeStats(s => ({...s, totalAscensions: s.totalAscensions + 1}));
    setRelics(0);
    setPrestigeCount(0);
    setPrestigeUpgrades(INITIAL_PRESTIGE_UPGRADES.map(pu => ({...pu, level: 0})));
    resetForPrestige();
    setShowAscensionModal(false);
  };

  const handleStartChallenge = (challengeId: string) => {
    if (activeChallengeId) return;
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    if (challenge) {
        setChallengeToStart(challenge);
    }
  };

  const confirmStartChallenge = () => {
    if (!challengeToStart) return;
    preChallengeState.current = {
      shards: stateRef.current.shards,
      upgrades: stateRef.current.upgrades,
      generators: stateRef.current.generators,
      skills: stateRef.current.skills,
      totalShardsEarned: stateRef.current.totalShardsEarned,
      totalClicks: stateRef.current.totalClicks,
      totalBossDefeats: stateRef.current.totalBossDefeats,
      goldenShardsClicked: stateRef.current.goldenShardsClicked,
      currentRunTime: stateRef.current.currentRunTime,
    };
    resetForPrestige(true);
    setActiveChallengeId(challengeToStart.id);
    setActiveTab(PanelTab.Generators);
    setChallengeToStart(null);
  };

  const cancelStartChallenge = () => {
      setChallengeToStart(null);
  };

  const handleExitChallenge = () => {
    if (!activeChallengeId || !preChallengeState.current) return;
    
    setShards(preChallengeState.current.shards);
    setUpgrades(preChallengeState.current.upgrades);
    setGenerators(preChallengeState.current.generators);
    setSkills(preChallengeState.current.skills);
    setTotalShardsEarned(preChallengeState.current.totalShardsEarned);
    setTotalClicks(preChallengeState.current.totalClicks);
    setTotalBossDefeats(preChallengeState.current.totalBossDefeats);
    setGoldenShardsClicked(preChallengeState.current.goldenShardsClicked);
    setCurrentRunTime(preChallengeState.current.currentRunTime);
    
    setActiveChallengeId(null);
    preChallengeState.current = null;
  };

  const handleCompleteChallenge = (challengeId: string) => {
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    if (preChallengeState.current) {
        handleExitChallenge();
    }
    setCompletedChallengeIds(ids => [...new Set([...ids, challengeId])]);
    setActiveChallengeId(null);

    if (challenge?.reward.type === 'UNLOCK_UPGRADE' && challenge.reward.payload?.upgradeId) {
      setUpgrades(upgs => upgs.map(u => 
        u.id === challenge.reward.payload!.upgradeId ? { ...u, isUnlocked: true } : u
      ));
    }
  };
  
  const handleSummonBoss = (bossId?: string) => {
    if (bossCooldown > 0 || currentBoss) return;
    
    let bossToSummon: ShardBoss;

    if (bossId) { // Fixed Guardian Boss
        const bossData = FIXED_BOSSES.find(b => b.id === bossId);
        if (!bossData) return;
        bossToSummon = {
            id: bossData.id,
            name: t(bossData.nameKey),
            maxHp: bossData.hp,
            currentHp: bossData.hp,
            reward: bossData.reward,
            timeLeft: BOSS_TIME_LIMIT_SECONDS,
            timeLimit: BOSS_TIME_LIMIT_SECONDS,
            category: 'guardian'
        };
    } else { // Scaled Patrol Boss
        const name = t('boss.patrol_name');
        const hp = totalSPS > 1 ? totalSPS * 45 : 500;
        const reward = totalSPS > 1 ? totalSPS * 90 : 1000;
        bossToSummon = {
            id: 'patrol_boss',
            name,
            maxHp: hp,
            currentHp: hp,
            reward,
            timeLeft: BOSS_TIME_LIMIT_SECONDS,
            timeLimit: BOSS_TIME_LIMIT_SECONDS,
            category: 'patrol'
        };
    }
    
    setCurrentBoss(bossToSummon);
    setBossAnimationState('summoning');
    setTimeout(() => setBossAnimationState('idle'), 500);
  };
  
  const handleActivateSkill = (id: string) => {
    const { totalSPS, createFloatingVisual, gameAreaRef } = stateRef.current;
    if (id === 'skill_shard_storm') setActiveMiniShards([]);
    if (id === 'skill_golden_touch') spawnGoldenShard();
    if (id === 'skill_time_warp') {
      const reward = totalSPS * 30 * 60; // 30 minutes of SPS
      gainShards(reward);
      if(gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        createFloatingVisual(`+${formatNumber(reward)} Shards!`, rect.width / 2, rect.height / 2, { isSpecial: true });
      }
    }
    setSkills(current => current.map(s => (s.id === id && s.type === 'ACTIVE' && s.level > 0 && !s.isActive && (s.cooldownRemaining ?? 0) <= 0) ? { ...s, isActive: true, durationRemaining: s.duration } : s));
  }
  
  const handlePointerDown = useCallback((e?: React.PointerEvent<HTMLButtonElement>) => {
    holdSource.current = 'mouse';
    executeClick(e?.clientX, e?.clientY, true);
    if ((stateRef.current.furiousClickingSkill?.level ?? 0) > 0) {
        setIsHolding(true);
    }
  }, [executeClick]);

  const handlePointerUp = useCallback(() => {
    setIsHolding(false);
    autoClickAccumulator.current = 0;
    holdSource.current = null;
  }, []);

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stateRef.current.isOmniClickUnlocked || !gameAreaRef.current || clickerRef.current?.contains(e.target as Node) || (e.target as HTMLElement).closest('.no-omniclick')) return;
    executeClick(e.clientX, e.clientY, false);
  };
  
  // FIX: Accept effectiveness parameter for auto-collection, which resolves a type error.
  const handleGoldenShardClick = useCallback((effectiveness = 1) => {
      if (!goldenShard || !gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = (goldenShard.x / 100) * rect.width;
      const y = (goldenShard.y / 100) * rect.height;
      
      const { totalSPS, shards, talismanBonuses, upgrades, prestigeBonuses } = stateRef.current;
      const rewardMultiplier = talismanBonuses.goldenShardMultiplier * prestigeBonuses.goldenShardRewardMultiplier * effectiveness;
      
      const rand = Math.random();
      if (rand < 0.7) { // 70% chance: Shards
          const reward = Math.max(shards * 0.1, totalSPS * 60) * rewardMultiplier;
          gainShards(reward);
          createFloatingVisual(t('golden_shard.shards', {value: formatNumber(reward)}), x, y, { isSpecial: true });
      } else if (rand < 0.8) { // 10% chance: Generator Surge
          const ownedGenerators = stateRef.current.generators.filter((g: Generator) => g.count > 0);
          if (ownedGenerators.length > 0) {
              const randomGen = ownedGenerators[Math.floor(Math.random() * ownedGenerators.length)];
              const reward = (stateRef.current.generatorOutputs[randomGen.id] || 0) * 300 * rewardMultiplier; // 5 minutes
              gainShards(reward);
              createFloatingVisual(t('golden_shard.generator_surge'), x, y, { isSpecial: true });
          }
      } else if (rand < 0.9) { // 10% chance: Click Frenzy
          setActiveBuffs(b => ({...b, click_frenzy: { timeLeft: 10 }}));
          createFloatingVisual(t('golden_shard.click_frenzy'), x, y, { isSpecial: true });
      } else if (rand < 0.98) { // 8% chance: Free upgrades
          const cheapestUpgrade = upgrades.filter((u: Upgrade) => u.level < (u.maxLevel ?? Infinity)).sort((a: Upgrade,b: Upgrade) => a.baseCost - b.baseCost)[0];
          if(cheapestUpgrade) {
              handleBuy('upgrade', cheapestUpgrade.id, 5);
              createFloatingVisual(t('golden_shard.free_upgrade', { value: 5 }), x, y, { isSpecial: true });
          }
      } else { // 2% chance: Cosmic Dust
          const dustReward = Math.floor(GOLDEN_SHARD_DUST_REWARD * effectiveness);
          if (dustReward > 0) {
            setCosmicDust(d => d + dustReward);
            createFloatingVisual(t('golden_shard.cosmic_dust', { value: dustReward }), x, y, { isSpecial: true });
          }
      }
      setGoldenShardsClicked(c => c + 1);
      setGoldenShard(null);
  }, [goldenShard, gainShards, createFloatingVisual, t]);

  const handleMiniShardClick = useCallback((id: number) => {
    setActiveMiniShards(shards => shards.filter(s => s.id !== id));
    gainShards(stateRef.current.totalSPS); // 1 second of SPS
  }, [gainShards]);

  const handleEscapeBoss = useCallback(() => {
    if (!stateRef.current.currentBoss) return;
    const fullCooldown = BOSS_COOLDOWN_SECONDS * (1 - stateRef.current.prestigeBonuses.bossCooldownReduction);
    setBossCooldown(fullCooldown / 2);
    setCurrentBoss(null);
    setBossAnimationState(null);
    if(gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        createFloatingVisual(t('boss.escaped'), rect.width / 2, rect.height / 2, { isSpecial: true });
    }
  }, [t, createFloatingVisual]);

  // =================================================================================================
  // == LOAD / SAVE
  // =================================================================================================
  const saveGame = useCallback(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...stateRef.current.saveState, lastSaveTime: Date.now() }));
  }, []);

  const hardReset = useCallback(() => {
    if (window.confirm(t('settings.reset_confirm'))) {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  }, [t]);
  
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const state = JSON.parse(savedData);
        setTotalShardsEarned(state.totalShardsEarned ?? 0);
        setTotalBossDefeats(state.totalBossDefeats ?? 0);
        setGoldenShardsClicked(state.goldenShardsClicked ?? 0);
        setCurrentRunTime(state.currentRunTime ?? 0);
        setAllTimeStats(state.allTimeStats ?? INITIAL_ALL_TIME_STATS);
        preChallengeState.current = state.preChallengeState ?? null;
        
        let loadedUpgrades = INITIAL_UPGRADES.map(u => {
            const saved = state.upgrades?.find((su: Upgrade) => su.id === u.id);
            return {...u, level: saved?.level ?? 0, isUnlocked: saved?.isUnlocked ?? u.isUnlocked ?? true };
        });
        
        const loadedGenerators = INITIAL_GENERATORS.map(g => {
            const saved = state.generators?.find((sg: Generator) => sg.id === g.id);
            return { ...g, count: saved?.count ?? 0, evolutionChoiceId: saved?.evolutionChoiceId ?? null, evolutionChoiceId2: saved?.evolutionChoiceId2 ?? null };
        });
        const loadedSkills = INITIAL_SKILLS.map(s => ({ ...s, level: state.skills?.find((ss: {id: string, level: number}) => ss.id === s.id)?.level ?? 0 }));
        const loadedPrestigeUpgrades = INITIAL_PRESTIGE_UPGRADES.map(pu => ({...pu, level: state.prestigeUpgrades?.find((spu: PrestigeUpgrade) => spu.id === pu.id)?.level ?? 0}));
        const loadedAscensionUpgrades = INITIAL_ASCENSION_UPGRADES.map(au => ({...au, level: state.ascensionUpgrades?.find((sau: AscensionUpgrade) => sau.id === au.id)?.level ?? 0}));
        const loadedTalismans = INITIAL_TALISMANS.map(t => {
            const saved = state.talismans?.find((st: Talisman) => st.id === t.id);
            return { ...t, isCrafted: saved?.isCrafted ?? false, equippedInLoadouts: saved?.equippedInLoadouts ?? [], level: saved?.level ?? 1 };
        });
        
        const loadedAchievements = INITIAL_ACHIEVEMENTS.map(a => {
            const isUnlocked = state.achievements?.find((sa: Achievement) => sa.id === a.id)?.isUnlocked ?? false;
            if (isUnlocked && a.bonus.type === 'UNLOCK_UPGRADE' && a.bonus.payload?.upgradeId) {
                loadedUpgrades = loadedUpgrades.map(u => u.id === a.bonus.payload!.upgradeId ? {...u, isUnlocked: true} : u);
            }
            return {...a, isUnlocked };
        });
        
        const loadedCompletedChallenges = state.completedChallengeIds ?? [];
        if (loadedCompletedChallenges.length > 0) {
            CHALLENGES.forEach(challenge => {
                if (loadedCompletedChallenges.includes(challenge.id) && challenge.reward.type === 'UNLOCK_UPGRADE' && challenge.reward.payload?.upgradeId) {
                     loadedUpgrades = loadedUpgrades.map(u => u.id === challenge.reward.payload!.upgradeId ? {...u, isUnlocked: true} : u);
                }
            });
        }

        const loadedRelics = state.relics ?? 0;
        let shardsOnLoad = state.shards ?? 0;
        
        setShards(shardsOnLoad);
        setTotalClicks(state.totalClicks ?? 0);
        setRelics(loadedRelics);
        setPrestigeCount(state.prestigeCount ?? 0);
        setSingularityEssence(state.singularityEssence ?? 0);
        setAscensionCount(state.ascensionCount ?? 0);
        setPurchasedSingularityNodeIds(state.purchasedSingularityNodeIds ?? ['sg_start']);
        setActiveChallengeId(state.activeChallengeId ?? null);
        setCompletedChallengeIds(loadedCompletedChallenges);
        setBossCooldown(state.bossCooldown ?? 0);
        setUpgrades(loadedUpgrades);
        setGenerators(loadedGenerators);
        setSkills(loadedSkills);
        setPrestigeUpgrades(loadedPrestigeUpgrades);
        setAscensionUpgrades(loadedAscensionUpgrades);
        setAchievements(loadedAchievements);
        setCosmicDust(state.cosmicDust ?? 0);
        setTalismans(loadedTalismans);
        setActiveTalismanLoadout(state.activeTalismanLoadout ?? 1);

        if (state.lastSaveTime) {
            lastSaveTimeRef.current = state.lastSaveTime;
        }

      } catch (e) { console.error("Failed to load saved game:", e); }
    }
    lastTickTime.current = Date.now();
  }, []);

  useEffect(() => {
    if (lastSaveTimeRef.current && totalSPS > 0) {
        const { offlineMultiplier } = talismanBonuses;
        const timeOffline = Math.min(Date.now() - lastSaveTimeRef.current, 24 * 60 * 60 * 1000); // Max 24h
        if (timeOffline > 10000) {
            const shardsEarned = totalSPS * (timeOffline / 1000) * offlineMultiplier;
            gainShards(shardsEarned);
            setOfflineProgress({ shards: shardsEarned, time: timeOffline });
            
            const storedPowerTalisman = talismans.find(t => t.id === 'talisman_stored_power' && t.equippedInLoadouts.includes(activeTalismanLoadout) && t.level > 0);
            if (storedPowerTalisman) {
                const hoursOffline = Math.min(timeOffline / (1000 * 60 * 60), 24); // cap at 24h
                const multiplier = 1 + (hoursOffline * 0.25 * (storedPowerTalisman.effect.value * storedPowerTalisman.level));
                const duration = 30 + hoursOffline * 2;
                setActiveBuffs(b => ({...b, stored_power: { timeLeft: duration, multiplier: multiplier }}));
            }
        }
        lastSaveTimeRef.current = null; // Ensure this runs only once on load
    }
  }, [totalSPS, talismanBonuses, gainShards]);

  useEffect(() => {
    const saveInterval = setInterval(saveGame, 30000);
    window.addEventListener('beforeunload', saveGame);
    return () => { clearInterval(saveInterval); window.removeEventListener('beforeunload', saveGame); };
  }, [saveGame]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Space' && !stateRef.current.showPrestigeModal && !spacebarHeld.current) {
            event.preventDefault();
            spacebarHeld.current = true;
            holdSource.current = 'spacebar';
            executeClick(undefined, undefined, false);
            if ((stateRef.current.furiousClickingSkill?.level ?? 0) > 0) {
                setIsHolding(true);
            }
        }
    };
     const handleKeyUp = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
            event.preventDefault();
            spacebarHeld.current = false;
            handlePointerUp();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [executeClick, handlePointerUp]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handlePointerUp();
        spacebarHeld.current = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handlePointerUp]);

  // =================================================================================================
  // == GAME LOOP
  // =================================================================================================
  useEffect(() => {
    stateRef.current = {
      shards, totalClicks, relics, prestigeCount, upgrades, generators, skills, achievements, prestigeUpgrades, isPaused,
      goldenShard, activeEvent, currentBoss, bossAnimationState, showPrestigeModal, totalShardsEarned, generatorOutputs,
      evolutionPreviewGenerator, allTimeStats, currentRunTime, totalBossDefeats, goldenShardsClicked,
      shardsPerClick, critChance, critDamage, totalSPS, currentShardTier, prestigeBonuses, singularityEssence, ascensionCount,
      ascensionUpgrades, activeChallengeId, completedChallengeIds, cosmicDust, talismans, talismanBonuses,
      challengeBonuses, singularityGridBonuses, activeTalismanLoadout,
      isOmniClickUnlocked, furiousClickingSkill, isHolding, holdSource: holdSource.current,
      bossDamageMultiplier,
      createFloatingVisual, createParticle, gameAreaRef,
      saveState: { 
          shards, totalClicks, totalShardsEarned, totalBossDefeats, goldenShardsClicked, currentRunTime, allTimeStats, relics, prestigeCount, singularityEssence, ascensionCount, cosmicDust, activeChallengeId, completedChallengeIds, purchasedSingularityNodeIds, activeTalismanLoadout,
          preChallengeState: preChallengeState.current,
          upgrades: upgrades.map(({id, level, isUnlocked}) => ({id, level, isUnlocked})), 
          generators: generators.map(({id, count, evolutionChoiceId, evolutionChoiceId2}) => ({id, count, evolutionChoiceId, evolutionChoiceId2})), 
          skills: skills.map(({id, level}) => ({id, level})), 
          achievements: achievements.map(({id, isUnlocked}) => ({id, isUnlocked})),
          prestigeUpgrades: prestigeUpgrades.map(({id, level}) => ({id, level})),
          ascensionUpgrades: ascensionUpgrades.map(({id, level}) => ({id, level})),
          talismans: talismans.map(({id, isCrafted, equippedInLoadouts, level}) => ({id, isCrafted, equippedInLoadouts, level})),
          bossCooldown 
      }
    };
  });
  
  useEffect(() => {
    const TICK_RATE = 100;

    const checkAchievements = () => {
        const { achievements, totalShardsEarned, totalClicks, generators, prestigeCount, totalBossDefeats, ascensionCount, talismans, completedChallengeIds } = stateRef.current;
        const newlyUnlocked: Achievement[] = [];

        for (const ach of achievements) {
            if (ach.isUnlocked) continue;
            let conditionMet = false;
            switch (ach.condition.type) {
                case 'totalShardsEarned': conditionMet = totalShardsEarned >= ach.condition.value; break;
                case 'totalClicks': conditionMet = totalClicks >= ach.condition.value; break;
                case 'generatorCount': conditionMet = (generators.find((g: Generator) => g.id === ach.condition.generatorId)?.count ?? 0) >= ach.condition.value; break;
                case 'prestigeCount': conditionMet = prestigeCount >= ach.condition.value; break;
                case 'haveOneOfEachGenerator': conditionMet = generators.filter((g: Generator) => g.count > 0).length >= ach.condition.value; break;
                case 'bossDefeats': conditionMet = totalBossDefeats >= ach.condition.value; break;
                case 'ascensionCount': conditionMet = ascensionCount >= ach.condition.value; break;
                case 'talismansCrafted': conditionMet = talismans.filter((t: Talisman) => t.isCrafted).length >= ach.condition.value; break;
                case 'challengesCompleted': conditionMet = completedChallengeIds.length >= ach.condition.value; break;
            }
            if (conditionMet) newlyUnlocked.push(ach);
        }

        if (newlyUnlocked.length > 0) {
            setAchievements(current =>
                current.map(ach => newlyUnlocked.find(unlocked => unlocked.id === ach.id) ? { ...ach, isUnlocked: true } : ach)
            );
            newlyUnlocked.forEach((ach, index) => {
                 setTimeout(() => {
                    setAchievementToast(ach);
                    setTimeout(() => setAchievementToast(null), 4000);

                    // Apply bonus
                    if (ach.bonus.type === 'GRANT_RELICS') setRelics(r => r + ach.bonus.value);
                    if (ach.bonus.type === 'UNLOCK_UPGRADE' && ach.bonus.payload?.upgradeId) {
                        setUpgrades(upgs => upgs.map(u => u.id === ach.bonus.payload!.upgradeId ? {...u, isUnlocked: true} : u));
                    }
                 }, index * 4200); // Stagger toasts
            });
        }
    };

    const gameTick = () => {
      if (stateRef.current.isPaused) return;

      const now = Date.now();
      const deltaTime = now - (lastTickTime.current ?? now);
      lastTickTime.current = now;
      const deltaSeconds = deltaTime / 1000;
      if (deltaSeconds <= 0) return;

      // Update timers
      setCurrentRunTime(t => t + deltaTime);
      setAllTimeStats(s => ({...s, totalTimePlayed: s.totalTimePlayed + deltaTime}));

      const { totalSPS, shardsPerClick, currentBoss, bossAnimationState, goldenShard, skills, isHolding, furiousClickingSkill, activeChallengeId, shards, holdSource, createFloatingVisual, activeBuffs, allTimeStats, talismanBonuses } = stateRef.current;
      
      if (allTimeStats.highestSPS < totalSPS) setAllTimeStats(s => ({...s, highestSPS: totalSPS}));
      if (allTimeStats.highestSPC < shardsPerClick) setAllTimeStats(s => ({...s, highestSPC: shardsPerClick}));

      if (!currentBoss) gainShards(totalSPS * deltaSeconds); 
      else if (bossAnimationState !== 'defeated') handleBossDamage(totalSPS * deltaSeconds);
      
      setBossCooldown(prev => Math.max(0, prev - deltaSeconds));
      setActiveEvent(prev => prev && prev.timeLeft - deltaSeconds > 0 ? { ...prev, timeLeft: prev.timeLeft - deltaSeconds } : null);
      if (goldenShard && now - goldenShard.createdAt > goldenShard.lifetime && talismanBonuses.autoCollectGoldenShard === 0) setGoldenShard(null);
      if (goldenShard && talismanBonuses.autoCollectGoldenShard > 0) {
          handleGoldenShardClick(talismanBonuses.autoCollectGoldenShard);
      }
      
      // Update active buffs
      const newBuffs = {...activeBuffs};
      let buffsChanged = false;
      Object.keys(newBuffs).forEach(key => {
          newBuffs[key].timeLeft -= deltaSeconds;
          if (newBuffs[key].timeLeft <= 0) {
              delete newBuffs[key];
              buffsChanged = true;
          }
      });
      if(buffsChanged) setActiveBuffs(newBuffs);

      // Handle Momentum Talisman
      if (talismanBonuses.isMomentumActive) {
          const momentumTalisman = talismans.find(t => t.id === 'talisman_momentum' && t.equippedInLoadouts.includes(activeTalismanLoadout));
          if (momentumTalisman) {
              const decayTime = 2000; // 2 seconds
              if (now - lastClickTimestamp.current > decayTime) {
                  if (activeBuffs.momentum) setActiveBuffs(b => { const newB = {...b}; delete newB.momentum; return newB; });
              } else {
                  const currentStacks = activeBuffs.momentum?.stacks ?? 0;
                  const maxStacks = momentumTalisman.effect.secondaryValue! * momentumTalisman.level;
                  const newStacks = Math.min(currentStacks + 1, maxStacks);
                  const newMultiplier = 1 + (newStacks * momentumTalisman.effect.value * momentumTalisman.level);
                  setActiveBuffs(b => ({...b, momentum: {timeLeft: decayTime / 1000, stacks: newStacks, multiplier: newMultiplier}}));
              }
          }
      }

      if (activeChallengeId) {
        const challenge = CHALLENGES.find(c => c.id === activeChallengeId);
        if (challenge && shards >= challenge.goal) {
          handleCompleteChallenge(challenge.id);
        }
      }

      if (currentBoss) {
          setCurrentBoss(boss => {
              if (!boss || stateRef.current.bossAnimationState === 'defeated') return boss;
              const newTimeLeft = boss.timeLeft - deltaSeconds;
              if (newTimeLeft <= 0) {
                  if(gameAreaRef.current) {
                    const rect = gameAreaRef.current.getBoundingClientRect();
                    createFloatingVisual(t('boss.escaped'), rect.width / 2, rect.height / 2, { isSpecial: true });
                  }
                  setBossCooldown(BOSS_COOLDOWN_SECONDS * (1 - stateRef.current.prestigeBonuses.bossCooldownReduction));
                  return null;
              }
              return { ...boss, timeLeft: newTimeLeft };
          });
      }

      // Random events
      if (!goldenShard && !stateRef.current.activeEvent && Math.random() < (0.3 / (60000 / TICK_RATE))) {
        if(Math.random() > 0.5) spawnGoldenShard();
        else setActiveEvent({ nameKey: 'events.cosmic_surge', multiplier: 3, timeLeft: 15 });
      }
      
      const frenziedClicksIsActive = skills.some((s: Skill) => s.id === 'skill_frenzied_clicks' && s.isActive);
      if (frenziedClicksIsActive) {
          const clicksToPerform = Math.round(10 * deltaSeconds);
          for (let i = 0; i < clicksToPerform; i++) executeClick();
      }
      
      const shardStormSkill = skills.find((s: Skill) => s.id === 'skill_shard_storm');
      if (shardStormSkill?.isActive) {
        // Spawn new mini shards
        if (Math.random() < deltaSeconds * 4) { // spawn rate
            setActiveMiniShards(current => [...current, {id: Date.now() + Math.random(), x: Math.random() * 90, y: -5, vy: 15 + Math.random() * 10}]);
        }
      }
      // Move mini shards
      setActiveMiniShards(current => current.map(s => ({...s, y: s.y + s.vy * deltaSeconds})).filter(s => s.y < 105));


      const furiousClickingCps = (furiousClickingSkill?.level ?? 0) * (furiousClickingSkill?.effectValue ?? 0);
      if (isHolding && furiousClickingCps > 0) {
        autoClickAccumulator.current += furiousClickingCps * deltaSeconds;
        const clicksToPerform = Math.floor(autoClickAccumulator.current);
        if (clicksToPerform > 0) {
            const isDirectHold = holdSource === 'mouse';
            for (let i = 0; i < clicksToPerform; i++) executeClick(undefined, undefined, isDirectHold);
            autoClickAccumulator.current -= clicksToPerform;
        }
      }

      setSkills(prevSkills => prevSkills.map(s => {
          if (s.type !== 'ACTIVE') return s;
          if (s.isActive) {
              const newDuration = (s.durationRemaining ?? 0) - deltaSeconds;
              if (newDuration <= 0) {
                  if(s.id === 'skill_shard_storm') setActiveMiniShards([]);
                  return { ...s, isActive: false, durationRemaining: 0, cooldownRemaining: s.cooldown };
              }
              return { ...s, durationRemaining: newDuration };
          }
          if ((s.cooldownRemaining ?? 0) > 0) {
              return { ...s, cooldownRemaining: Math.max(0, (s.cooldownRemaining ?? 0) - deltaSeconds) };
          }
          return s;
      }));
      
      checkAchievements();
    };

    const intervalId = setInterval(gameTick, TICK_RATE);
    return () => clearInterval(intervalId);
  }, [gainShards, handleBossDamage, executeClick]);

  return {
    shards, totalClicks, totalShardsEarned, totalBossDefeats, relics, prestigeCount, singularityEssence, ascensionCount,
    cosmicDust, upgrades, generators, skills, achievements, prestigeUpgrades, ascensionUpgrades, talismans,
    activeChallengeId, completedChallengeIds, isPaused, isHolding, activeTab, buyAmount, showPrestigeModal,
    showAscensionModal, showEvolutionModal, generatorToEvolve, evolutionPreviewGenerator, challengeToStart,
    offlineProgress, goldenShard, activeEvent, activeBuffs, activeMiniShards, currentBoss, bossCooldown,
    bossAnimationState, achievementToast, clickerRef, gameAreaRef, activeTalismanLoadout, allTimeStats, currentRunTime,
    goldenShardsClicked, purchasedSingularityNodeIds,

    setActiveTab, setBuyAmount, setShowPrestigeModal, setShowAscensionModal, setShowEvolutionModal,
    setGeneratorToEvolve, setEvolutionPreviewGenerator, setChallengeToStart, setOfflineProgress, setGoldenShard,
    setActiveEvent, setActiveBuffs, setActiveMiniShards, setCurrentBoss, setBossCooldown, setBossAnimationState,
    setAchievementToast, togglePause, setActiveTalismanLoadout,
    
    createFloatingVisual, createParticle,
    
    achievementBonuses, ascensionBonuses, prestigeBonuses, talismanBonuses, challengeModifiers, currentShardTier,
    critChance, critDamage, bossDamageMultiplier, shardsPerClick, totalSPS, generatorOutputs,
    upgradeTotalEffects, relicsOnPrestige, canPrestige, essenceOnAscension, canAscend,
    
    prestigeReq: PRESTIGE_REQ, ascensionReqRelics: ASCENSION_REQ_RELICS,
    
    availableFixedBosses, isOmniClickUnlocked, furiousClickingSkill,
    
    gainShards, handleBossDamage, spawnGoldenShard, executeClick, handleBuy, handleBuyPrestigeUpgrade,
    handleBuyAscensionUpgrade, handleBuySingularityNode, handleCraftTalisman, handleUpgradeTalisman, handleEquipTalisman,
    openEvolutionModal, openEvolutionPreviewModal, closeEvolutionModal, handleEvolveGenerator, resetForPrestige,
    handlePrestige, handleAscend, handleStartChallenge, confirmStartChallenge, cancelStartChallenge,
    handleExitChallenge, handleCompleteChallenge, handleSummonBoss, handleActivateSkill, handlePointerDown,
    handlePointerUp, handleAreaClick, handleGoldenShardClick, handleMiniShardClick, saveGame, hardReset,
    handleEscapeBoss,
    
    loreEntries: LORE_ENTRIES,
    challenges: CHALLENGES,
    singularityGridNodes: SINGULARITY_GRID_NODES,
    calculations: {
      bulkCost: calculateBulkCost,
      maxAffordable: calculateMaxAffordable
    }
  };
};

export type useGameHook = ReturnType<typeof useGame>;