import React from 'react';
import { Talisman } from '../../types';
import { useGameHook } from '../../hooks/useGame';
import { formatNumber } from '../../utils/format';
import { CosmicDustIcon } from '../icons';

const TalismanCard: React.FC<{
    talisman: Talisman,
    dust: number,
    canEquip: boolean,
    onCraft: (id: string) => void,
    onEquip: (id: string) => void,
    onUpgrade: (id: string) => void,
    activeLoadout: number,
    t: (key: string, replacements?: { [key: string]: string | number }) => string
}> = ({ talisman, dust, canEquip, onCraft, onEquip, onUpgrade, activeLoadout, t }) => {
    const isEquipped = talisman.equippedInLoadouts.includes(activeLoadout);
    const upgradeCost = Math.floor(talisman.cost * Math.pow(talisman.costMultiplier, talisman.level));
    const canAffordUpgrade = dust >= upgradeCost;
    const isMaxLevel = talisman.level >= talisman.maxLevel;

    const renderTalismanEffect = () => {
        const { type, value, secondaryValue } = talisman.effect;
        const totalValue = value * talisman.level;
        const totalSecondaryValue = (secondaryValue ?? 0) * talisman.level;
        const effectContainerStyle = "bg-violet-400/10 p-3 rounded-lg";
        const titleStyle = "text-sm font-bold text-violet-700 dark:text-violet-300";
        const valueStyle = "text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5";

        if (talisman.level === 0 && talisman.isCrafted) {
            return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_panel.upgrade')}</p><p className={valueStyle}>Upgrade to see effects.</p></div>)
        }
        if (!talisman.isCrafted) return null;

        switch (type) {
            case 'CRIT_BOOST': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.crit_boost')}</p><p className={valueStyle}>{t('talisman_effect.crit_boost_desc', { chance: (totalValue * 100).toFixed(1), damage: (totalSecondaryValue * 100).toFixed(1) })}</p></div>);
            case 'GOLDEN_SHARD_BOOST': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.golden_shard_boost')}</p><p className={valueStyle}>{t('talisman_effect.golden_shard_boost_desc', { value: (1 + totalValue).toFixed(2) })}</p></div>);
            case 'OFFLINE_SPS_BOOST': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.offline_sps_rate')}</p><p className={valueStyle}>{t('talisman_effect.offline_sps_rate_desc')}</p></div>);
            case 'IDLE_SPS_BOOST_PER_RELIC': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.sps_per_relic')}</p><p className={valueStyle}>{t('talisman_effect.sps_per_relic_desc', { value: (totalValue * 100).toFixed(2) })}</p></div>);
            case 'SHARDLING_SPS_BOOST': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.shardling_sps_boost')}</p><p className={valueStyle}>{t('talisman_effect.shardling_sps_boost_desc', { value: (1 + totalValue).toFixed(1) })}</p></div>);
            case 'BOSS_DUST_MULTIPLIER': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.boss_dust_multiplier')}</p><p className={valueStyle}>{t('talisman_effect.boss_dust_multiplier_desc', { value: (1 + totalValue).toFixed(1) })}</p></div>);
            case 'STORED_POWER_BONUS': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.stored_power_bonus')}</p><p className={valueStyle}>{t('talisman_effect.stored_power_bonus_desc', { value: (1 + totalValue).toFixed(1) })}</p></div>);
            case 'RELIC_ON_CLICK_CHANCE': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.relic_on_click_chance')}</p><p className={valueStyle}>{t('talisman_effect.relic_on_click_chance_desc', { value: (totalValue * 100).toPrecision(2) })}</p></div>);
            case 'MOMENTUM_CLICK_BOOST': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.momentum_click_boost')}</p><p className={valueStyle}>{t('talisman_effect.momentum_click_boost_desc', { value: (totalValue * 100).toFixed(0), max: (totalSecondaryValue * totalValue * 100).toFixed(0) })}</p></div>);
            case 'SHARD_CAP_SPS_BOOST': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.shard_cap_sps_boost')}</p><p className={valueStyle}>{t('talisman_effect.shard_cap_sps_boost_desc', { value: totalValue })}</p></div>);
            case 'AUTO_COLLECT_GOLDEN_SHARD': return (<div className={effectContainerStyle}><p className={titleStyle}>{t('talisman_effect.auto_collect_golden_shard')}</p><p className={valueStyle}>{t('talisman_effect.auto_collect_golden_shard_desc', { value: (totalValue * 100).toFixed(0) })}</p></div>);
            default: return null;
        }
    }

    return (
        <div className={`bg-white/60 dark:bg-slate-800/30 rounded-2xl p-4 flex flex-col gap-4 ${isEquipped ? 'ring-2 ring-violet-500' : ''}`}>
             <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                    <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight">
                        {t(talisman.nameKey)}
                    </h3>
                     {talisman.isCrafted && <p className="text-md text-slate-500 dark:text-slate-400 font-semibold -mt-1">{t('level_short', {level: talisman.level})}/{talisman.maxLevel}</p>}
                    <p className="text-base text-slate-600 dark:text-slate-300 mt-2">{t(talisman.descriptionKey)}</p>
                    {talisman.isCrafted && (
                        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                            {renderTalismanEffect()}
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                     <button
                        onClick={() => onEquip(talisman.id)}
                        disabled={!talisman.isCrafted || (!isEquipped && !canEquip)}
                        className={`h-14 px-6 w-full rounded-full text-lg font-bold transition-colors duration-200
                            ${isEquipped
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                    >
                        {isEquipped ? t('talisman_panel.equipped') : t('talisman_panel.equip')}
                    </button>
                </div>
            </div>
            
             <div className="flex-shrink-0 w-full">
                {!talisman.isCrafted ? (
                     <button
                        onClick={() => onCraft(talisman.id)}
                        disabled={dust < talisman.cost}
                        className={`h-14 px-4 w-full rounded-full text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-95
                            ${dust >= talisman.cost
                            ? 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white shadow-md'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            }`} >
                        <span className="font-semibold text-base">{t('talisman_panel.craft')}</span>
                        <CosmicDustIcon className="w-6 h-6" />
                        <span className="font-bold tracking-tight">{formatNumber(talisman.cost)}</span>
                    </button>
                ) : !isMaxLevel ? (
                    <button
                        onClick={() => onUpgrade(talisman.id)}
                        disabled={!canAffordUpgrade}
                        className={`h-14 px-4 w-full rounded-full text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-95
                            ${canAffordUpgrade
                            ? 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white shadow-md'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            }`} >
                        <span className="font-semibold text-base">{t('talisman_panel.upgrade')}</span>
                        <CosmicDustIcon className="w-6 h-6" />
                        <span className="font-bold tracking-tight">{formatNumber(upgradeCost)}</span>
                    </button>
                ) : (
                    <div className="h-14 w-full flex items-center justify-center font-bold text-purple-600 dark:text-purple-400">MAX LEVEL</div>
                )}
            </div>
        </div>
    );
};

export const TalismansPanel: React.FC<{game: useGameHook, t: (key: string, replacements?: { [key: string]: string | number }) => string}> = ({ game, t }) => {
    const { talismans, cosmicDust, prestigeBonuses, handleCraftTalisman, handleEquipTalisman, handleUpgradeTalisman, activeTalismanLoadout, setActiveTalismanLoadout } = game;
    const equippedCount = talismans.filter(t => t.equippedInLoadouts.includes(activeTalismanLoadout)).length;
    const maxSlots = prestigeBonuses.talismanSlots;
    return (
    <div className="space-y-3">
        <div className="text-center p-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 px-1">{t('talisman_panel.title')} ({equippedCount}/{maxSlots})</h2>
            <p className="text-slate-600 dark:text-slate-300">{t('talisman_panel.desc')}</p>
        </div>
        <div className="p-2 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl">
             <h3 className="font-bold text-lg text-center mb-2">{t('talisman_panel.loadouts')}</h3>
             <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => setActiveTalismanLoadout(1)} className={`py-2 px-4 rounded-lg font-bold transition-colors ${activeTalismanLoadout === 1 ? 'bg-violet-600 text-white' : 'bg-slate-300 dark:bg-slate-700'}`}>{t('talisman_panel.loadout_1')}</button>
                 <button onClick={() => setActiveTalismanLoadout(2)} className={`py-2 px-4 rounded-lg font-bold transition-colors ${activeTalismanLoadout === 2 ? 'bg-violet-600 text-white' : 'bg-slate-300 dark:bg-slate-700'}`}>{t('talisman_panel.loadout_2')}</button>
             </div>
        </div>
        {game.talismans
            .slice()
            .sort((a, b) => a.cost - b.cost)
            .map(talisman => (
                <TalismanCard
                    key={talisman.id}
                    talisman={talisman}
                    dust={cosmicDust}
                    canEquip={equippedCount < maxSlots}
                    onCraft={handleCraftTalisman}
                    onEquip={handleEquipTalisman}
                    onUpgrade={handleUpgradeTalisman}
                    activeLoadout={activeTalismanLoadout}
                    t={t}
                />
        ))}
    </div>
)};
