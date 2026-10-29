import { HeroStats, HeroAppearance } from '../types/game';

const STORAGE_KEY = 'math_quest_hero_data_v2';

export const DEFAULT_APPEARANCE: HeroAppearance = {
  skinTone: 'light',
  hairStyle: 'spiky',
  hairColor: 'brown',
  outfitColor: 'red',
  weaponType: 'sword',
  headgear: 'headband',
  aura: 'flame',
};

export const DEFAULT_HERO: HeroStats = {
  name: 'Arya',
  heroClass: 'warrior',
  appearance: DEFAULT_APPEARANCE,
  level: 1,
  exp: 0,
  gold: 80,
  baseAtk: 25,
  atkUpgradeLevel: 1,
  maxHp: 100,
  hpUpgradeLevel: 1,
  defense: 10, // 10% damage reduction
  defUpgradeLevel: 1,
  speedBonus: 1.5, // 1.5x multiplier for speed answers
  speedUpgradeLevel: 1,
  regen: 0,
  regenUpgradeLevel: 0,
  potions: 2,
  timeFreezes: 1,
  shields: 1,
  hints5050: 2,
  unlockedLevel: 1,
  levelStars: {},
  highScoreEndless: 0,
  totalCorrect: 0,
  totalBattlesWon: 0,
};

export const getSavedHero = (): HeroStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check v1 fallback
      const oldRaw = localStorage.getItem('math_quest_hero_data_v1');
      if (oldRaw) {
        const parsedOld = JSON.parse(oldRaw);
        return {
          ...DEFAULT_HERO,
          ...parsedOld,
          appearance: DEFAULT_APPEARANCE,
        };
      }
      return DEFAULT_HERO;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_HERO,
      ...parsed,
      appearance: {
        ...DEFAULT_APPEARANCE,
        ...(parsed.appearance || {}),
      },
    };
  } catch (err) {
    console.error('Failed to load hero data from storage', err);
    return DEFAULT_HERO;
  }
};

export const saveHero = (hero: HeroStats): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hero));
  } catch (err) {
    console.error('Failed to save hero data', err);
  }
};

export const resetHero = (): HeroStats => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('math_quest_hero_data_v1');
  } catch {
    // Ignore
  }
  return { ...DEFAULT_HERO };
};

// Upgrade calculation costs
export const getUpgradeCost = (currentLevel: number, statType: 'atk' | 'hp' | 'def' | 'speed' | 'regen'): number => {
  switch (statType) {
    case 'atk':
      return currentLevel * 90;
    case 'hp':
      return currentLevel * 80;
    case 'def':
      return currentLevel * 100;
    case 'speed':
      return currentLevel * 95;
    case 'regen':
      return (currentLevel + 1) * 110;
  }
};

export const ITEM_COSTS = {
  potion: 40,
  timeFreeze: 55,
  shield: 60,
  hint5050: 35,
};
