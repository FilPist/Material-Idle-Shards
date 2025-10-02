import React from 'react';

// Main Shard Icon (Hexagon)
export const ShardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L3 7.5V16.5L12 22L21 16.5V7.5L12 2Z" />
  </svg>
);

export const EvolvingShardIcon: React.FC<{ tier: number; className?: string; isClicking: boolean; onAnimationEnd: () => void; }> = ({ tier, className, isClicking, onAnimationEnd }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} ${isClicking ? 'shard-anim-click' : ''}`}
      onAnimationEnd={onAnimationEnd}
    >
      <defs>
        <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{ stopColor: tier >= 3 ? '#e9d5ff' : '#c4b5fd', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="warp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" result="turbulence" seed="10">
                <animate attributeName="baseFrequency" dur="25s" values="0.01;0.025;0.01" repeatCount="indefinite" />
            </feTurbulence>
            <feGaussianBlur in="turbulence" stdDeviation="1.5" result="smoothedTurbulence" />
            <feDisplacementMap in="SourceGraphic" in2="smoothedTurbulence" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* Base Shard */}
      <circle cx="50" cy="50" r="45" fill="url(#grad1)" filter="url(#warp)" className="shard-anim-breath" />
      
      {/* Tier 1 - Inner Hexagon */}
      {tier >= 0 && (
         <path d="M50 15 L 80 32.5 L 80 67.5 L 50 85 L 20 67.5 L 20 32.5 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="hexagon-anim-float"/>
      )}

      {/* Tier 2 - Crystalline Core */}
      {tier >= 1 && (
        <path d="M50 35 L 65 42.5 L 65 57.5 L 50 65 L 35 57.5 L 35 42.5 Z" fill="rgba(255,255,255,0.3)" className="animate-pulse"/>
      )}
      
      {/* Tier 3 - Astral Shard */}
       {tier >= 2 && (
        <>
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(233, 213, 255, 0.5)" strokeWidth="1.5" strokeDasharray="5 10" className="animate-[spin_20s_linear_infinite]" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(233, 213, 255, 0.3)" strokeWidth="1" strokeDasharray="2 5" className="animate-[spin_15s_linear_infinite_reverse]" />
        </>
      )}

       {/* Tier 4 - Singularity */}
       {tier >= 3 && (
        <circle cx="50" cy="50" r="10" fill="#fff" filter="url(#glow)" />
       )}
    </svg>
  );
};

export const BossShardIcon: React.FC<{ className?: string; isClicking: boolean; onAnimationEnd: () => void; }> = ({ className, isClicking, onAnimationEnd }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} ${isClicking ? 'shard-anim-click' : ''}`}
      onAnimationEnd={onAnimationEnd}
    >
      <defs>
        <radialGradient id="gradBoss" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{ stopColor: '#fca5a5', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#b91c1c', stopOpacity: 1 }} />
        </radialGradient>
        <filter id="warpBoss" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="turbulence" seed="66">
                <animate attributeName="baseFrequency" dur="15s" values="0.02;0.035;0.02" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
         <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base Shard */}
      <circle cx="50" cy="50" r="45" fill="url(#gradBoss)" filter="url(#warpBoss)" className="shard-anim-breath" />
      
      {/* Jagged Core */}
      <path d="M50 20 L 70 30 L 80 50 L 70 70 L 50 80 L 30 70 L 20 50 L 30 30 Z" 
            fill="rgba(0,0,0,0.2)" stroke="rgba(255,100,100,0.3)" strokeWidth="1.5" className="hexagon-anim-float" 
            style={{animationDuration: '4s'}}/>
      
      {/* Menacing Eye */}
      <circle cx="50" cy="50" r="12" fill="#450a0a" />
      <circle cx="50" cy="50" r="8" fill="#facc15" filter="url(#glowRed)" className="animate-pulse" style={{animationDuration: '1.5s'}}/>
       <circle cx="50" cy="50" r="3" fill="#1e293b" />
    </svg>
  );
};


// Click / Manual Power (Hand Pointer)
export const ClickIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.2,19.55,3.35,14.7,4.77,13.28,8.2,16.71,9.62,15.29,4.77,10.45,3.35,11.87,8.2,16.71,13.05,11.87,11.63,10.45,9.62,12.46,13.05,9.03,14.47,10.45,10.05,14.88,8.63,16.29,13.47,21.14,14.89,19.72,10.05,14.88,11.46,13.46,14.89,16.89,16.31,15.47,11.46,10.62,13.05,9.03,17.89,4.18,19.31,5.6,14.47,10.45,19.31,15.29,20.73,13.87,15.89,9.03,17.31,7.6,12.46,12.46,13.88,13.87,9.03,18.72,7.6,20.14,9.03,15.29,13.87,13.88,15.29,18.72,10.45,20.14,9.03,21.56,10.45,16.71,15.29,18.13,13.87,13.28,18.72,11.87,20.14,16.71,15.29,8.2,19.55Z" />
  </svg>
);

// Automation / Generators / SPS (Cog)
export const AutomationIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.44,12.99a1,1,0,0,0-1.28.78,5.47,5.47,0,0,1-10.33,0,1,1,0,0,0-1.28-.78,7.5,7.5,0,0,0,12.89,0ZM12,8.5A2.5,2.5,0,1,0,14.5,6,2.5,2.5,0,0,0,12,8.5Z M19,4.77a8.53,8.53,0,0,0-2.4-2.4,1,1,0,0,0-1.42,1.42,6.47,6.47,0,0,1,1.88,1.88,1,1,0,1,0,2-.9Z M5,4.77a1,1,0,1,0-2,.9,6.47,6.47,0,0,1,1.88-1.88A1,1,0,0,0,3.5,2.37,8.53,8.53,0,0,0,5,4.77Z" />
  </svg>
);

// Upgrades (Arrow Up)
export const UpgradeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
  </svg>
);

// Skills (Bolt)
export const BoltIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7 2v11h3v9l7-12h-4l4-8H7z"/>
  </svg>
);

// Prestige / Relics (Star)
export const PrestigeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,17.27L18.18,21L16.36,13.97L22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.64,13.97L5.82,21L12,17.27Z" />
  </svg>
);
export const StarIcon = PrestigeIcon;

// Achievements / Trophy
export const AchievementIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.5 10H19V8h1.5a.5.5 0 0 0 0-1H19V5.5a.5.5 0 0 0-1 0V7h-1.5a.5.5 0 0 0 0 1H17v2h-1.5a.5.5 0 0 0 0 1H17v1.5a.5.5 0 0 0 1 0V11h1.5a.5.5 0 0 0 0-1zM12 2C8.69 2 6 4.69 6 8s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-7-2H3v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10h-2c0 3.31-2.69 6-6 6s-6-2.69-6-6z"/>
  </svg>
);

// Ascension / Singularity (Vortex)
export const SingularityIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8 S16.4,20,12,20z M12,6c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S15.3,6,12,6z M12,16c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4 S14.2,16,12,16z"/>
    </svg>
);

// Talisman (Amulet)
export const TalismanIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 10.99h-4V7.48l4-1.99v7.5z"/>
    </svg>
);


// Cosmic Dust (Sparkle)
export const CosmicDustIcon = StarIcon;

// Lore / Story
export const BookIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5C5.33 4.5 4.11 4.65 3 5V19c1.11.35 2.33.5 3.5.5 1.95 0 4.05-.4 5.5-1.5 1.45 1.1 3.55 1.5 5.5 1.5 1.17 0 2.39-.15 3.5-.5V5zM21 18.5c-1.1.3-2.3.45-3.5.45-1.7 0-3.55-.25-5.5-1.5V6.95c1.95-.75 3.8-1 5.5-1 .35 0 .7.05 1 .1v12.45z"/>
    </svg>
);

// FIX: Add missing ChartBarIcon
export const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

// Halloween Theme
export const BatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.316l-1.04.548c-3.13 1.65-4.14 2.227-4.14 5.438v.919l-.173.043C3.963 10.04 2 11.24 2 13v1c0 .7.538 1.25 1.25 1.25h1.5A1.25 1.25 0 0 0 6 14v-1l-.002-1.25h.001L6 11.5v-2c0-2.43 1.26-3.14 3.75-4.434L12 3.684l2.25 1.382C16.74 6.36 18 7.07 18 9.5v2l.001.25H18V13a1.25 1.25 0 0 0 1.25 1.25h1.5C21.462 14.25 22 13.7 22 13v-1c0-1.76-1.963-2.96-4.644-3.724l-.173-.043v-.919c0-3.21-1.01-3.788-4.14-5.438L12 2.316z"/>
  </svg>
);

// Boss Fights
export const BossIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/>
  </svg>
);

// Christmas Theme
export const SnowflakeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.1 9.5h-3.1l1.5-2.6c.4-.7.1-1.6-.6-2l-2-1.2c-.7-.4-1.6-.1-2 .6L14.4 7v-3c0-.8-.7-1.5-1.5-1.5h-1.8c-.8 0-1.5.7-1.5 1.5v3L8.2 4.4c-.4-.7-1.3-1-2-.6l-2 1.2c-.7.4-1 .1-1.4-1.2l-2.6-1.5h-3c0-.8-.7-1.5-1.5-1.5h-1.8c-.8 0-1.5.7-1.5 1.5v3l-2.6-1.5c-.7-.4-1.6-.1-2 .6l-1.2 2c-.4.7-.1 1.6.6 2l2.6 1.5v3.1h-2.6c-.8 0-1.5.7-1.5 1.5v1.8c0 .8.7 1.5 1.5 1.5h2.6v3.1l-2.6 1.5c-.7.4-1 .1-1.4-1.2l-1.2-2-1.5-1.5v1.8c0 .8.7 1.5 1.5 1.5h3l1.5 2.6c.4.7 1.3 1 2 .6l2-1.2c.7-.4 1-.1 1.4 1.2l2.6 1.5h3c0 .8.7 1.5 1.5 1.5h1.8c.8 0 1.5-.7 1.5-1.5v-3l2.6-1.5c.7-.4 1.6-.1 2 .6l1.2-2c.4-.7.1-1.6-.6-2l-2.6-1.5v-3.1h2.6c.8 0 1.5-.7 1.5-1.5v-1.8c0-.8-.7-1.5-1.5-1.5zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
    </svg>
);

// Settings (Gear)
export const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
    </svg>
);

// New Skill Icons
export const GoldenTouchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5.5 22.5c-.83 0-1.5-.67-1.5-1.5v-12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v12c0 .83-.67 1.5-1.5 1.5zM12 22.5c-.83 0-1.5-.67-1.5-1.5V3.75c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v17.25c0 .83-.67 1.5-1.5 1.5zM8.75 22.5c-.83 0-1.5-.67-1.5-1.5V7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v13.5c0 .83-.67 1.5-1.5 1.5zM15.25 22.5c-.83 0-1.5-.67-1.5-1.5v-8.25c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v8.25c0 .83-.67 1.5-1.5 1.5zM18.5 22.5c-.83 0-1.5-.67-1.5-1.5v-12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v12c0 .83-.67 1.5-1.5 1.5z" />
        <path d="M17.5 7.5l-3.25-3.25-1.25 1.25L15.41 8H8.59L11 5.59l-1.25-1.25L6.5 7.5 2 12l4.5 4.5 1.25-1.25L5.41 13h13.17l-2.34 2.25 1.25 1.25L22 12l-4.5-4.5z" opacity=".3"/>
    </svg>
);

export const TimeWarpIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        <path d="M21.29 8.71L20.5 8l-.79.71-1.29-1.29.79-.71-.79-.71-1.29 1.29-.79-.71.79-.71-1.29-1.29L15 6l.71.71 1.29-1.29.79.71-.79.71 1.29 1.29.79-.71-.79-.71 1.29 1.29.71-.71zM4.5 16l-.71-.71-1.29 1.29-.79-.71.79-.71-1.29-1.29-.79.71.79.71-1.29-1.29L2.71 15.29 3.5 16l.79-.71 1.29 1.29-.79.71.79.71 1.29-1.29.79.71-.79.71 1.29 1.29.71.71z" opacity=".3"/>
    </svg>
);