import React, { useState, useEffect, useRef } from 'react';
import { HeroStats, LevelInfo, Question, MathCategory } from '../types/game';
import { getFreshBattleQuestion } from '../data/questions';
import { sound } from '../utils/audio';
import { HeroSprite, MonsterSprite } from './GameSprites';
import { BukuPanduanModal } from './BukuPanduanModal';
import { Heart, Shield, Zap, Sparkles, BookOpen, Volume2, VolumeX, Pause, Play, AlertCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  levelInfo: LevelInfo;
  hero: HeroStats;
  isEndless?: boolean;
  onVictory: (stars: number, earnedGold: number, earnedExp: number, damageDealt: number) => void;
  onDefeat: () => void;
  onExit: () => void;
  onUpdateHero: (updated: HeroStats) => void;
}

interface FloatingText {
  id: number;
  text: string;
  type: 'crit' | 'normal' | 'hero_hit' | 'heal' | 'shield';
  x: number;
  y: number;
}

export const BattleScreen: React.FC<Props> = ({
  levelInfo,
  hero,
  isEndless = false,
  onVictory,
  onDefeat,
  onExit,
  onUpdateHero,
}) => {
  // Combat State
  const [heroHp, setHeroHp] = useState<number>(hero.maxHp);
  const [monsterHp, setMonsterHp] = useState<number>(levelInfo.monster.maxHp);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<Set<number | string>>(new Set());
  
  // Timer & Speed Multiplier
  const initialTime = levelInfo.monster.attackSpeedSeconds;
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isTimeFrozen, setIsTimeFrozen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Active Shields & Combos
  const [hasShieldActive, setHasShieldActive] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [totalDamageDone, setTotalDamageDone] = useState<number>(0);

  // Visual Sprites State
  const [heroAction, setHeroAction] = useState<'idle' | 'attack' | 'hit' | 'victory'>('idle');
  const [monsterAction, setMonsterAction] = useState<'idle' | 'attack' | 'hit'>('idle');
  const [shakeScreen, setShakeScreen] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [activeTaunt, setActiveTaunt] = useState<string>(levelInfo.monster.taunts[0]);

  // Mistakes / Review Explanation Modal
  const [wrongReview, setWrongReview] = useState<{
    userAnswer: number | string;
    correctAnswer: number | string;
    explanation: string;
  } | null>(null);

  // Audio & Modals
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isHandbookOpen, setIsHandbookOpen] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const usedQuestionsRef = useRef<Set<string>>(new Set());

  // Load a new unique question
  const loadNextQuestion = () => {
    setHiddenOptions(new Set());
    setTimeLeft(initialTime);

    let nextQ: Question;
    if (isEndless) {
      const allCategories: MathCategory[] = [
        'garis_bilangan',
        'penjumlahan',
        'pengurangan',
        'perkalian_pembagian',
        'operasi_campuran',
        'soal_cerita',
      ];
      const cat = allCategories[Math.floor(Math.random() * allCategories.length)];
      nextQ = getFreshBattleQuestion(cat, usedQuestionsRef.current);
    } else {
      nextQ = getFreshBattleQuestion(levelInfo.category, usedQuestionsRef.current);
    }
    setCurrentQuestion(nextQ);
  };

  // Initial load
  useEffect(() => {
    loadNextQuestion();
  }, []);

  // Main countdown battle loop
  useEffect(() => {
    if (isPaused || isTimeFrozen || wrongReview !== null || monsterHp <= 0 || heroHp <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired! Monster attacks!
          handleMonsterTurn('Kehabisan Waktu!');
          return initialTime;
        }
        if (prev <= 4) {
          sound.playTick();
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isTimeFrozen, wrongReview, monsterHp, heroHp]);

  // Trigger floating damage text
  const addFloatingText = (text: string, type: FloatingText['type'], isTargetMonster: boolean) => {
    const id = Date.now() + Math.random();
    const x = isTargetMonster ? 70 + Math.random() * 10 : 25 + Math.random() * 10;
    const y = 40 + Math.random() * 10;
    setFloatingTexts((prev) => [...prev, { id, text, type, x, y }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Trigger screen shake
  const triggerShake = () => {
    setShakeScreen(true);
    setTimeout(() => setShakeScreen(false), 400);
  };

  // Player answers a question
  const handleAnswer = (chosen: number | string) => {
    if (!currentQuestion || wrongReview !== null) return;

    const isCorrect = String(chosen).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      // Calculate speed ratio
      const timeUsed = initialTime - timeLeft;
      const speedRatio = timeLeft / initialTime;

      // Base Attack
      const baseAtk = hero.baseAtk;
      let multiplier = 1.0;
      let attackLabel = 'SERANGAN!';
      let isCrit = false;

      if (speedRatio >= 0.7) {
        // Answered in first 30% of time -> INSTANT CRITICAL!
        multiplier = hero.speedBonus * 1.5;
        attackLabel = '⚡ KRITIKAL KILAT!';
        isCrit = true;
      } else if (speedRatio >= 0.45) {
        multiplier = hero.speedBonus * 1.15;
        attackLabel = '⚔️ SERANGAN CEPAT!';
      } else if (speedRatio >= 0.2) {
        multiplier = 1.1;
        attackLabel = 'TEPAT!';
      } else {
        multiplier = 1.0;
        attackLabel = 'SERANGAN BIASA';
      }

      // Combo streak bonus (+10% per streak up to +50%)
      const streakBonus = 1 + Math.min(0.5, comboStreak * 0.1);
      const totalDamage = Math.round(baseAtk * multiplier * streakBonus);

      // Sound & visuals
      sound.playCorrect(isCrit);
      sound.playSlash(isCrit);

      setHeroAction('attack');
      setMonsterAction('hit');
      triggerShake();

      // Damage text
      addFloatingText(`-${totalDamage} (${attackLabel})`, isCrit ? 'crit' : 'normal', true);

      // Hero regen skill if upgraded
      if (hero.regen > 0) {
        setHeroHp((prev) => Math.min(hero.maxHp, prev + hero.regen));
        addFloatingText(`+${hero.regen} HP`, 'heal', false);
      }

      // Apply damage to monster
      const newMonsterHp = Math.max(0, monsterHp - totalDamage);
      setMonsterHp(newMonsterHp);
      setTotalDamageDone((prev) => prev + totalDamage);
      setComboStreak((prev) => prev + 1);
      setQuestionCount((prev) => prev + 1);

      setTimeout(() => {
        setHeroAction('idle');
        setMonsterAction('idle');
      }, 350);

      // Check if monster defeated!
      if (newMonsterHp <= 0) {
        handleMonsterDefeated();
        return;
      }

      // Change monster taunt
      const randomTaunt = levelInfo.monster.taunts[Math.floor(Math.random() * levelInfo.monster.taunts.length)];
      setActiveTaunt(randomTaunt);

      // Next question
      loadNextQuestion();
    } else {
      // Wrong answer!
      sound.playWrong();
      setComboStreak(0);

      // Trigger monster retaliation
      handleMonsterTurn('Jawaban Kurang Tepat!');

      // Open explanation review
      setWrongReview({
        userAnswer: chosen,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
      });
    }
  };

  // Monster takes action (on wrong answer or timer expiration)
  const handleMonsterTurn = (cause: string) => {
    setMonsterAction('attack');

    setTimeout(() => {
      if (hasShieldActive) {
        // Shield absorbs attack!
        setHasShieldActive(false);
        sound.playCorrect();
        addFloatingText('🛡️ PERISAI MENAHAN SERANGAN!', 'shield', false);
        setMonsterAction('idle');
        return;
      }

      sound.playMonsterAttack();
      setHeroAction('hit');
      triggerShake();

      // Monster damage calculated with hero's DEF % reduction
      const rawDmg = levelInfo.monster.attackPower;
      const reducedDmg = Math.max(5, Math.round(rawDmg * (1 - hero.defense / 100)));

      addFloatingText(`-${reducedDmg} HP`, 'hero_hit', false);
      const newHeroHp = Math.max(0, heroHp - reducedDmg);
      setHeroHp(newHeroHp);

      setTimeout(() => {
        setHeroAction('idle');
        setMonsterAction('idle');
      }, 400);

      // Check if Hero Defeated
      if (newHeroHp <= 0) {
        sound.playDefeat();
        setTimeout(() => {
          onDefeat();
        }, 800);
      }
    }, 250);
  };

  // Monster defeated victory handler
  const handleMonsterDefeated = () => {
    sound.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Calculate stars: 3 stars if HP > 70%, 2 stars if HP > 35%, else 1 star
    const hpPercent = (heroHp / hero.maxHp) * 100;
    let stars = 1;
    if (hpPercent >= 70) stars = 3;
    else if (hpPercent >= 35) stars = 2;

    // Rewards
    const earnedGold = levelInfo.monster.goldReward + (stars * 15);
    const earnedExp = levelInfo.monster.expReward;

    setTimeout(() => {
      onVictory(stars, earnedGold, earnedExp, totalDamageDone);
    }, 1200);
  };

  // Item Use Handlers
  const handleUsePotion = () => {
    if (hero.potions <= 0 || heroHp >= hero.maxHp) return;
    sound.playHeal();
    const healAmount = Math.round(hero.maxHp * 0.35);
    setHeroHp((prev) => Math.min(hero.maxHp, prev + healAmount));
    addFloatingText(`+${healAmount} HP`, 'heal', false);

    const updated = { ...hero, potions: hero.potions - 1 };
    onUpdateHero(updated);
  };

  const handleUseTimeFreeze = () => {
    if (hero.timeFreezes <= 0 || isTimeFrozen) return;
    sound.playCorrect();
    setIsTimeFrozen(true);
    addFloatingText('⏳ WAKTU TERBEKU 8 DETIK!', 'shield', false);

    const updated = { ...hero, timeFreezes: hero.timeFreezes - 1 };
    onUpdateHero(updated);

    setTimeout(() => {
      setIsTimeFrozen(false);
    }, 8000);
  };

  const handleUseShield = () => {
    if (hero.shields <= 0 || hasShieldActive) return;
    sound.playCorrect();
    setHasShieldActive(true);
    addFloatingText('🛡️ PERISAI AKTIF!', 'shield', false);

    const updated = { ...hero, shields: hero.shields - 1 };
    onUpdateHero(updated);
  };

  const handleUse5050 = () => {
    if (hero.hints5050 <= 0 || !currentQuestion || hiddenOptions.size > 0) return;
    sound.playCorrect();

    // Identify 2 wrong options to hide
    const wrongOpts = currentQuestion.options.filter(
      (opt) => String(opt) !== String(currentQuestion.correctAnswer)
    );
    const toHide = new Set<number | string>(wrongOpts.slice(0, 2));
    setHiddenOptions(toHide);
    addFloatingText('💡 2 OPSI SALAH DIHAPUS!', 'crit', false);

    const updated = { ...hero, hints5050: hero.hints5050 - 1 };
    onUpdateHero(updated);
  };

  // Background Theme Gradient
  const getThemeBackground = () => {
    switch (levelInfo.backgroundTheme) {
      case 'forest':
        return 'from-emerald-950 via-slate-950 to-teal-950';
      case 'crystal_cave':
        return 'from-cyan-950 via-slate-950 to-blue-950';
      case 'misty_swamp':
        return 'from-purple-950 via-slate-950 to-slate-900';
      case 'volcano':
        return 'from-amber-950 via-red-950 to-slate-950';
      case 'ancient_shrine':
        return 'from-yellow-950 via-stone-950 to-amber-950';
      case 'sky_tower':
        return 'from-indigo-950 via-pink-950 to-slate-950';
      default:
        return 'from-slate-950 to-slate-900';
    }
  };

  // Speed bar color & percentage
  const speedPercentage = (timeLeft / initialTime) * 100;
  const speedColor =
    speedPercentage > 60
      ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
      : speedPercentage > 30
      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
      : 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse';

  return (
    <div className={`relative min-h-screen w-full bg-gradient-to-b ${getThemeBackground()} text-white flex flex-col justify-between overflow-hidden select-none ${shakeScreen ? 'animate-shake' : ''}`}>
      
      {/* Floating Damage / Heal Numbers */}
      {floatingTexts.map((item) => (
        <div
          key={item.id}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          className={`absolute z-40 font-black text-base md:text-xl transform -translate-x-1/2 pointer-events-none animate-float-fade ${
            item.type === 'crit'
              ? 'text-yellow-300 drop-shadow-[0_2px_10px_rgba(234,179,8,0.8)] scale-125'
              : item.type === 'heal'
              ? 'text-emerald-300 drop-shadow-[0_2px_8px_rgba(16,185,129,0.8)]'
              : item.type === 'shield'
              ? 'text-cyan-300 drop-shadow-[0_2px_8px_rgba(56,189,248,0.8)]'
              : item.type === 'hero_hit'
              ? 'text-rose-400 drop-shadow-[0_2px_8px_rgba(244,63,94,0.8)]'
              : 'text-amber-200'
          }`}
        >
          {item.text}
        </div>
      ))}

      {/* TOP HUD: Perimeter Status Clusters */}
      <div className="w-full px-4 py-3 bg-slate-950/70 border-b border-slate-800 backdrop-blur-sm z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Level & Topic Indicator */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
              Level {levelInfo.levelNumber}
            </span>
            <div>
              <h1 className="text-xs md:text-sm font-bold text-white font-game truncate max-w-[140px] md:max-w-xs">
                {levelInfo.title}
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Topik: {levelInfo.topic}
              </p>
            </div>
          </div>

          {/* Combo Streak & Speed Bonus Indicator */}
          {comboStreak > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 font-bold text-xs animate-bounce">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Kombo x{comboStreak} ({comboStreak * 10}% Bonus DMG!)</span>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsHandbookOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition text-xs font-semibold flex items-center gap-1"
              title="Buku Catatan Rumus"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Rumus</span>
            </button>
            <button
              onClick={() => setIsMuted(sound.toggleMute())}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Suara"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Jeda"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={onExit}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition text-xs font-bold"
            >
              Menyerah
            </button>
          </div>
        </div>
      </div>

      {/* MID ARENA: Characters, Taunts, and Health Bars */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-2 flex flex-col justify-around relative z-10">
        
        {/* Battle Arena Stage */}
        <div className="grid grid-cols-2 gap-4 items-end relative py-4">
          
          {/* LEFT: HERO SIDE */}
          <div className="flex flex-col items-center sm:items-start space-y-2">
            {/* Hero Health Bar */}
            <div className="w-full max-w-[220px] bg-slate-900/90 border border-slate-700 p-2.5 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-white flex items-center gap-1">
                  {hero.name} {hasShieldActive && <span className="text-[10px] text-cyan-400">🛡️ Kebal</span>}
                </span>
                <span className="font-mono text-rose-400 font-bold text-[11px] tabular-nums">
                  {heroHp}/{hero.maxHp} HP
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, (heroHp / hero.maxHp) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Hero Animated Sprite */}
            <div className="relative pt-2">
              {hasShieldActive && (
                <div className="absolute inset-0 border-4 border-cyan-400/60 rounded-full animate-ping pointer-events-none"></div>
              )}
              <HeroSprite
                heroClass={hero.heroClass}
                appearance={hero.appearance}
                actionState={heroAction}
              />
            </div>
          </div>

          {/* RIGHT: MONSTER SIDE */}
          <div className="flex flex-col items-center sm:items-end space-y-2">
            {/* Monster Health Bar */}
            <div className="w-full max-w-[220px] bg-slate-900/90 border border-slate-700 p-2.5 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-amber-400 truncate max-w-[120px]">
                  {levelInfo.monster.name}
                </span>
                <span className="font-mono text-amber-300 font-bold text-[11px] tabular-nums">
                  {monsterHp}/{levelInfo.monster.maxHp} HP
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, (monsterHp / levelInfo.monster.maxHp) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Monster Taunt Bubble */}
            <div className="relative max-w-[200px] bg-slate-900/90 border border-slate-700 text-slate-200 text-[11px] p-2 rounded-xl rounded-tr-none shadow-md hidden sm:block">
              <p className="italic">"{activeTaunt}"</p>
            </div>

            {/* Monster Animated Sprite */}
            <div className="relative pt-2">
              <MonsterSprite levelNumber={levelInfo.levelNumber} actionState={monsterAction} />
            </div>
          </div>

        </div>

        {/* SPEED COUNTDOWN & DAMAGE MULTIPLIER BAR */}
        <div className="w-full bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Zap className="w-4 h-4" />
              <span>Pengali Serangan Kecepatan:</span>
              <strong className="text-white font-mono">
                {speedPercentage > 70 ? 'x2.5 (KRITIKAL!)' : speedPercentage > 45 ? 'x1.8 (CEPAT)' : speedPercentage > 20 ? 'x1.2 (NORMAL)' : 'x1.0 (BIASA)'}
              </strong>
            </span>
            <span className="font-mono tabular-nums text-slate-300">
              {isTimeFrozen ? '❄️ BEKU (8s)' : `${timeLeft.toFixed(1)}s`}
            </span>
          </div>

          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full ${speedColor} transition-all duration-100 rounded-full`}
              style={{ width: `${speedPercentage}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: Question Box & Battle Inventory */}
      <div className="w-full bg-slate-950/95 border-t-2 border-slate-800 p-4 md:p-6 z-30">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Question Prompt */}
          <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 text-center shadow-xl relative">
            <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
              Soal {questionCount + 1}
            </div>
            <h2 className="text-lg md:text-2xl font-black text-white font-game tracking-wide">
              {currentQuestion?.questionText || 'Memuat soal matematika bilangan bulat...'}
            </h2>
          </div>

          {/* Multiple Choice Options (Large, Tactile Buttons) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {currentQuestion?.options.map((opt, idx) => {
              const isHidden = hiddenOptions.has(opt);
              return (
                <button
                  key={idx}
                  disabled={isHidden}
                  onClick={() => handleAnswer(opt)}
                  className={`p-3.5 md:p-4 rounded-2xl font-black text-base md:text-xl font-mono tracking-wider transition transform active:scale-95 shadow-lg border-2 ${
                    isHidden
                      ? 'opacity-20 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-600'
                      : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 border-slate-700 text-white'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Consumable Inventory Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold hidden sm:inline">
              Bantuan Tempur:
            </span>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto justify-center">
              {/* Potion Button */}
              <button
                onClick={handleUsePotion}
                disabled={hero.potions <= 0 || heroHp >= hero.maxHp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 disabled:opacity-30 disabled:cursor-not-allowed border border-rose-500/40 text-rose-300 font-bold transition"
              >
                <span>🧪 Ramuan HP</span>
                <span className="bg-rose-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {hero.potions}
                </span>
              </button>

              {/* Time Freeze Button */}
              <button
                onClick={handleUseTimeFreeze}
                disabled={hero.timeFreezes <= 0 || isTimeFrozen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed border border-cyan-500/40 text-cyan-300 font-bold transition"
              >
                <span>⏳ Beku Waktu</span>
                <span className="bg-cyan-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {hero.timeFreezes}
                </span>
              </button>

              {/* Shield Button */}
              <button
                onClick={handleUseShield}
                disabled={hero.shields <= 0 || hasShieldActive}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 disabled:opacity-30 disabled:cursor-not-allowed border border-sky-500/40 text-sky-300 font-bold transition"
              >
                <span>🛡️ Perisai</span>
                <span className="bg-sky-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {hero.shields}
                </span>
              </button>

              {/* 50:50 Hint Button */}
              <button
                onClick={handleUse5050}
                disabled={hero.hints5050 <= 0 || hiddenOptions.size > 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-30 disabled:cursor-not-allowed border border-yellow-500/40 text-yellow-300 font-bold transition"
              >
                <span>💡 50:50</span>
                <span className="bg-yellow-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {hero.hints5050}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* EDUCATIONAL REVIEW MODAL ON MISTAKE */}
      {wrongReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-rose-400 font-game">
                  Kiat Solusi Matematika
                </h3>
                <p className="text-xs text-slate-400">
                  Monster menyerang! Pelajari pembahasan berikut agar seranganmu berikutnya berhasil:
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-xs mb-5">
              <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">Jawaban Kamu:</span>
                <span className="font-bold font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                  {wrongReview.userAnswer} (Kurang Tepat)
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">Jawaban Benar:</span>
                <span className="font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-sm">
                  {wrongReview.correctAnswer}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-amber-300 font-bold block mb-1">Pembahasan Langkah:</span>
                <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  {wrongReview.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setWrongReview(null);
                loadNextQuestion();
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>Lanjut Bertarung!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PAUSE MODAL */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 text-center text-white space-y-4">
            <h3 className="text-xl font-bold font-game text-amber-400">Game Dijeda</h3>
            <p className="text-xs text-slate-300">
              Tarik napas sejenak, siapkan strategi matematika terbaikmu!
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                Lanjutkan Permainan
              </button>
              <button
                onClick={() => { setIsPaused(false); setIsHandbookOpen(true); }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700"
              >
                Buka Kitab Rumus
              </button>
              <button
                onClick={onExit}
                className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition border border-rose-500/30"
              >
                Keluar ke Peta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handbook Cheatsheet Modal */}
      <BukuPanduanModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

    </div>
  );
};
