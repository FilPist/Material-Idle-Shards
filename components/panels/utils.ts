import { Upgrade, Skill } from '../../types';
import { formatNumber } from '../../utils/format';

export const getUpgradeEffectDescription = (u: Upgrade, totalEffectValue: number, t: (key: string, replacements?: { [key: string]: string | number }) => string) => {
    const getEffectKey = (): string => {
        switch (u.effectType) {
          case 'ADD': return 'upgrade.effect.add_click';
          case 'MULTIPLY_CLICK': return 'upgrade.effect.multiply_click';
          case 'MULTIPLY_SPS': return 'upgrade.effect.multiply_sps';
          case 'CRIT_CHANCE': return 'upgrade.effect.crit_chance';
          case 'CRIT_DAMAGE': return 'upgrade.effect.crit_damage';
          default: return '';
        }
    };

    const effectKey = getEffectKey();
    const isPercent = u.effectType?.includes('MULTIPLY') || u.effectType === 'CRIT_CHANCE' || u.effectType === 'CRIT_DAMAGE';
    const perLevelValue = isPercent ? ((u.effectValue ?? 0) * 100).toFixed(1) : (u.effectValue ?? 0);
    const perLevel = t(effectKey, { value: perLevelValue });
    
    const totalValue = isPercent ? formatNumber(totalEffectValue * 100) : formatNumber(totalEffectValue);
    const total = t(u.totalEffectKey, { value: totalValue });
    
    return { perLevel, total };
}

export const getSkillEffectDescription = (s: Skill, totalEffectValue: number, t: (key: string, replacements?: { [key: string]: string | number }) => string) => {
    const getEffectKey = (): string => {
        switch (s.effectType) {
          case 'AUTO_CLICK_CPS': return 'skill.effect.auto_click_cps';
          case 'SHARDLING_COUNT': return 'skill.effect.shardling_count';
          case 'BOSS_DAMAGE_MULTIPLIER': return 'skill.effect.boss_damage_mult';
          default: return '';
        }
    };

    const effectKey = getEffectKey();
    const isPercent = s.effectType === 'BOSS_DAMAGE_MULTIPLIER';
    const perLevelValue = isPercent ? ((s.effectValue ?? 0) * 100).toFixed(0) : (s.effectValue ?? 0);
    const perLevel = t(effectKey, { value: perLevelValue });

    const totalValue = isPercent ? formatNumber(totalEffectValue * 100) : formatNumber(totalEffectValue);
    const total = t(s.totalEffectKey ?? '', { value: totalValue });
    
    return { perLevel, total };
}