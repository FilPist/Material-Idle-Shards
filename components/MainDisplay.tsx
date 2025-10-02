import React from 'react';
import { useGameHook } from '../hooks/useGame';
import { ShardIcon, BatIcon, BossIcon, SnowflakeIcon, EvolvingShardIcon, BossShardIcon } from './icons';
import { formatNumber, formatDuration } from '../utils/format';
import { ShardBoss, MiniShard } from '../types';

interface DisplayProps {
  game: useGameHook;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const TIER_COLORS = ['#a78bfa', '#c4b5fd', '#e9d5ff', '#ffffff'];

const ShardlingVisuals: React.FC<{ count: number, color: string }> = React.memo(({ count, color }) => {
  if (count === 0) return null;
  const animationDuration = 10; // Corresponds to 'orbit' animation duration in index.html

  return (
    <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="shardling" 
          style={{ 
            animationDelay: `-${(i * animationDuration) / count}s`,
            backgroundColor: color
          }} 
        />
      ))}
    </div>
  );
});

const Bats: React.FC = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bat" style={{ top: `${Math.random() * 80}vh`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${5 + Math.random() * 5}s` }}>
        <BatIcon className="w-8 h-8 opacity-70" style={{ transform: `scale(${0.5 + Math.random()})` }}/>
      </div>
    ))}
  </div>
));

const Snowfall: React.FC = React.memo(() => (
  <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden z-10">
    {[...Array(50)].map((_, i) => (
      <div key={i} className="snow-flake" style={{ left: `${Math.random() * 100}vw`, width: `${2 + Math.random() * 4}px`, height: `${2 + Math.random() * 4}px`, animationDelay: `${Math.random() * 10}s`, animationDuration: `${5 + Math.random() * 10}s`}}></div>
    ))}
  </div>
));

const ShardStormVisuals: React.FC<{ shards: MiniShard[], onClick: (id: number) => void }> = React.memo(({ shards, onClick }) => {
    if (!shards || shards.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-30">
            {shards.map(shard => (
                <button
                    key={shard.id}
                    className="absolute w-8 h-8 text-violet-300 pointer-events-auto"
                    style={{
                        left: `${shard.x}%`,
                        top: `${shard.y}%`,
                        transition: 'top 0.1s linear',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(shard.id);
                    }}
                >
                    <ShardIcon className="w-full h-full" />
                </button>
            ))}
        </div>
    );
});

const ShardClicker: React.FC<{game: useGameHook}> = ({ game }) => {
    const { currentShardTier, currentBoss, bossAnimationState, handlePointerDown, handlePointerUp } = game;
    const [isAnimatingClick, setIsAnimatingClick] = React.useState(false);

    const handleLocalPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        handlePointerDown(e);
        setIsAnimatingClick(true);
    };
    
    const clickerClasses = [
        'relative w-48 h-48 sm:w-64 sm:h-64',
        'flex items-center justify-center text-white select-none',
        'transform-gpu cursor-pointer',
        bossAnimationState === 'summoning' && 'boss-summon-animation',
        bossAnimationState === 'hit' && 'boss-damage-animation',
        bossAnimationState === 'defeated' && 'boss-defeat-animation',
    ].filter(Boolean).join(' ');

    const isBossActive = !!currentBoss;

    return (
        <button 
            ref={game.clickerRef} 
            onPointerDown={handleLocalPointerDown} 
            onPointerUp={handlePointerUp} 
            onPointerLeave={handlePointerUp} 
            className={clickerClasses}
        >
            {isBossActive ? (
                <BossShardIcon
                    className="w-full h-full"
                    isClicking={isAnimatingClick}
                    onAnimationEnd={() => setIsAnimatingClick(false)}
                />
            ) : (
                <EvolvingShardIcon 
                    tier={currentShardTier.index} 
                    className="w-full h-full" 
                    isClicking={isAnimatingClick}
                    onAnimationEnd={() => setIsAnimatingClick(false)}
                />
            )}
        </button>
    );
};

const BossHealthBar: React.FC<{boss: ShardBoss; onEscape: () => void; t: (key: string) => string;}> = ({ boss, onEscape, t }) => (
    <div className="w-full max-w-sm p-2 flex flex-col items-center z-20 relative">
        <button onClick={onEscape} className="absolute top-2 right-2 text-xs px-3 py-1 bg-slate-500/50 hover:bg-slate-600/50 text-white rounded-full transition-colors">{t('boss.escape_button')}</button>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 drop-shadow-sm">{boss.name}</h3>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mt-1 border border-slate-300 dark:border-slate-600 shadow-inner">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full boss-hp-bar-inner" style={{width: `${(boss.currentHp / boss.maxHp) * 100}%`}}></div>
        </div>
        <div className="w-full flex justify-between items-center">
          <p className="font-bold text-slate-600 dark:text-slate-300 mt-1 text-sm drop-shadow-sm">{formatNumber(boss.currentHp)} / {formatNumber(boss.maxHp)}</p>
          <p className="font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-1 drop-shadow-sm">{boss.timeLeft.toFixed(1)}s</p>
        </div>
    </div>
);

const BossSummoner: React.FC<DisplayProps> = ({ game, t }) => {
    const { bossCooldown, handleSummonBoss, availableFixedBosses } = game;
    return (
         <div className="flex flex-col items-center gap-3">
            <button 
                onClick={() => handleSummonBoss()} 
                disabled={bossCooldown > 0}
                className="px-5 py-2.5 rounded-full font-bold text-white transition-all duration-200 transform active:scale-95 shadow-md hover:shadow-lg disabled:shadow-sm disabled:cursor-not-allowed flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 dark:disabled:bg-slate-600"
            >
                <BossIcon className="w-5 h-5"/>
                <span className="text-sm">{bossCooldown > 0 ? t('boss.cooldown', { time: formatDuration(bossCooldown * 1000) }) : t('boss.summon_patrol_button')}</span>
            </button>
            <div className="flex flex-wrap justify-center gap-2">
                {availableFixedBosses.map(boss => (
                     <button 
                        key={boss.id}
                        onClick={() => handleSummonBoss(boss.id)} 
                        disabled={bossCooldown > 0}
                        className="px-4 py-2 rounded-full font-bold text-white text-xs transition-all duration-200 transform active:scale-95 shadow-sm hover:shadow-md disabled:shadow-sm disabled:cursor-not-allowed flex items-center gap-2 bg-red-800 hover:bg-red-900 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                       <span>{t('boss.challenge_button', { name: t(boss.nameKey) })}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export const MainDisplay: React.FC<DisplayProps> = ({ game, t }) => {
  const shardlingCount = game.upgradeTotalEffects['skill_shardling_conjure'] ?? 0;
  const activeEvent = game.activeEvent;
  const shardlingColor = TIER_COLORS[game.currentShardTier.index] ?? '#a78bfa';
  
  return (
    <div ref={game.gameAreaRef} onClick={game.handleAreaClick} className="h-full w-full flex flex-col items-center justify-between relative cursor-pointer">
        {/* Thematic Overlays */}
        {game.currentBoss?.theme === 'halloween' && <Bats />}
        {game.currentBoss?.theme === 'christmas' && <Snowfall />}
        <ShardStormVisuals shards={game.activeMiniShards} onClick={game.handleMiniShardClick} />
        
        {/* Top Area */}
        <div className="h-24 pt-2 w-full">
          {activeEvent && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-white font-bold px-4 py-2 rounded-full shadow-lg z-10 text-sm sm:text-base animate-pulse">
                  {t(activeEvent.nameKey, { multiplier: activeEvent.multiplier, time: activeEvent.timeLeft.toFixed(1) })}
              </div>
          )}
          {game.activeBuffs.click_frenzy && (
             <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white font-bold px-4 py-1 rounded-full shadow-lg z-10 text-sm animate-pulse">
                {t('golden_shard.click_frenzy_active', { time: game.activeBuffs.click_frenzy.timeLeft.toFixed(1) })}
              </div>
          )}
           {game.activeBuffs.stored_power && (
             <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-sky-500 text-white font-bold px-4 py-1 rounded-full shadow-lg z-10 text-sm animate-pulse">
                {t('buffs.stored_power_active', { multiplier: formatNumber(game.activeBuffs.stored_power.multiplier), time: game.activeBuffs.stored_power.timeLeft.toFixed(1) })}
              </div>
          )}
          {game.currentBoss ? <BossHealthBar boss={game.currentBoss} onEscape={game.handleEscapeBoss} t={t} /> : <BossSummoner game={game} t={t} />}
        </div>

        {/* Middle Clicker Area */}
        <div className="relative flex items-center justify-center">
          <ShardlingVisuals count={shardlingCount} color={shardlingColor} />
          <ShardClicker game={game} />
          {game.goldenShard && (
              <button
                  onClick={(e) => { e.stopPropagation(); game.handleGoldenShardClick(); }}
                  className="golden-shard absolute w-16 h-16 sm:w-20 sm:h-20 text-amber-300 z-20"
                  style={{ left: `${game.goldenShard.x}%`, top: `${game.goldenShard.y}%` }}
              >
                  <ShardIcon className="w-full h-full" />
              </button>
          )}
        </div>
        
        {/* Bottom Summoner Area */}
        <div className="h-24 w-full flex items-center justify-center">
            {/* Now an empty spacer */}
        </div>
    </div>
  );
};