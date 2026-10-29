export type GameScreen = 'title' | 'map' | 'battle' | 'upgrade' | 'endless' | 'handbook';

export type HeroClass = 'warrior' | 'mage' | 'archer' | 'paladin';

export interface HeroAppearance {
  skinTone: 'light' | 'tan' | 'warm';
  hairStyle: 'short' | 'spiky' | 'long' | 'ponytail';
  hairColor: 'brown' | 'black' | 'blonde' | 'crimson' | 'cyan' | 'purple';
  outfitColor: 'red' | 'blue' | 'emerald' | 'gold' | 'purple' | 'dark';
  weaponType: 'sword' | 'staff' | 'bow' | 'spear';
  headgear: 'headband' | 'wizard_hat' | 'crown' | 'knight_helm' | 'none';
  aura: 'none' | 'flame' | 'lightning' | 'frost' | 'cosmic';
}

export interface HeroStats {
  name: string;
  heroClass: HeroClass;
  appearance: HeroAppearance;
  level: number;
  exp: number;
  gold: number;
  // Attributes with upgrade levels
  baseAtk: number;
  atkUpgradeLevel: number;
  maxHp: number;
  hpUpgradeLevel: number;
  defense: number; // percentage damage reduction
  defUpgradeLevel: number;
  speedBonus: number; // multiplier boost on fast answers
  speedUpgradeLevel: number;
  regen: number; // HP healed per round
  regenUpgradeLevel: number;
  // Consumable inventory
  potions: number;
  timeFreezes: number;
  shields: number;
  hints5050: number;
  // Progress
  unlockedLevel: number; // 1 to 6
  levelStars: Record<number, number>; // level index -> stars (1-3)
  highScoreEndless: number;
  totalCorrect: number;
  totalBattlesWon: number;
}

export type MathCategory = 
  | 'garis_bilangan'
  | 'penjumlahan'
  | 'pengurangan'
  | 'perkalian_pembagian'
  | 'operasi_campuran'
  | 'soal_cerita';

export interface Question {
  id: string;
  category: MathCategory;
  questionText: string;
  contextExplanation?: string;
  options: (number | string)[];
  correctAnswer: number | string;
  explanation: string;
  numberLineHint?: {
    start: number;
    step: number;
    result: number;
  };
}

export interface Monster {
  id: string;
  level: number;
  name: string;
  title: string;
  lore: string;
  element: 'ice' | 'nature' | 'dark' | 'fire' | 'metal' | 'cosmic';
  maxHp: number;
  attackPower: number;
  attackSpeedSeconds: number;
  goldReward: number;
  expReward: number;
  colorTheme: {
    primary: string;
    secondary: string;
    glow: string;
  };
  taunts: string[];
  victoryCry: string;
}

export interface LevelInfo {
  levelNumber: number;
  title: string;
  subTitle: string;
  topic: string;
  description: string;
  category: MathCategory;
  backgroundTheme: 'forest' | 'crystal_cave' | 'misty_swamp' | 'volcano' | 'ancient_shrine' | 'sky_tower';
  monster: Monster;
  targetQuestions: number;
}
