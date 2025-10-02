export interface FloatingNumber {
  id: number;
  value: string;
  x: number;
  y: number;
  isSpecial?: boolean;
  isCrit?: boolean;
}

export interface GoldenShard {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  lifetime: number;
}

export type ShardBossCategory = 'patrol' | 'guardian';

export interface ShardBoss {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  timeLimit: number;
  timeLeft: number;
  reward: number;
  category: ShardBossCategory;
  theme?: 'default' | 'halloween' | 'christmas';
}

export interface MiniShard {
  id: number;
  x: number; // percentage
  y: number; // percentage
  vy: number; // velocity y
}

export interface ActiveEvent {
    nameKey: string;
    multiplier: number;
    timeLeft: number;
}
