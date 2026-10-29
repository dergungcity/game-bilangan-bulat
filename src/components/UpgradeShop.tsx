import React from 'react';
import { HeroStats } from '../types/game';
import { getUpgradeCost, ITEM_COSTS, saveHero } from '../utils/storage';
import { sound } from '../utils/audio';
import { HeroSprite } from './GameSprites';
import { ArrowLeft, Swords, Shield, Heart, Zap, Sparkles, Plus, Clock, HelpCircle, Palette } from 'lucide-react';

interface Props {
  hero: HeroStats;
  onUpdateHero: (updated: HeroStats) => void;
  onOpenCustomizer: () => void;
  onBack: () => void;
}

export const UpgradeShop: React.FC<Props> = ({ hero, onUpdateHero, onOpenCustomizer, onBack }) => {
  const handleUpgradeStat = (statType: 'atk' | 'hp' | 'def' | 'speed' | 'regen') => {
    let currentLvl = 1;
    if (statType === 'atk') currentLvl = hero.atkUpgradeLevel;
    if (statType === 'hp') currentLvl = hero.hpUpgradeLevel;
    if (statType === 'def') currentLvl = hero.defUpgradeLevel;
    if (statType === 'speed') currentLvl = hero.speedUpgradeLevel;
    if (statType === 'regen') currentLvl = hero.regenUpgradeLevel;

    const cost = getUpgradeCost(currentLvl, statType);
    if (hero.gold < cost) {
      sound.playWrong();
      return;
    }

    sound.playUpgrade();
    const newHero: HeroStats = { ...hero, gold: hero.gold - cost };

    if (statType === 'atk') {
      newHero.atkUpgradeLevel += 1;
      newHero.baseAtk += 8; // +8 damage
    } else if (statType === 'hp') {
      newHero.hpUpgradeLevel += 1;
      newHero.maxHp += 20; // +20 max HP
    } else if (statType === 'def') {
      newHero.defUpgradeLevel += 1;
      newHero.defense = Math.min(50, newHero.defense + 5); // +5% defense, cap at 50%
    } else if (statType === 'speed') {
      newHero.speedUpgradeLevel += 1;
      newHero.speedBonus = Number((newHero.speedBonus + 0.2).toFixed(1)); // +0.2x speed multiplier
    } else if (statType === 'regen') {
      newHero.regenUpgradeLevel += 1;
      newHero.regen += 4; // +4 HP regen per turn
    }

    // Recalculate hero rank level based on total upgrades
    const totalUpgrades =
      newHero.atkUpgradeLevel +
      newHero.hpUpgradeLevel +
      newHero.defUpgradeLevel +
      newHero.speedUpgradeLevel +
      newHero.regenUpgradeLevel;
    newHero.level = Math.floor(totalUpgrades / 3) + 1;

    saveHero(newHero);
    onUpdateHero(newHero);
  };

  const handleBuyItem = (itemType: 'potion' | 'timeFreeze' | 'shield' | 'hint5050') => {
    const cost = ITEM_COSTS[itemType];
    if (hero.gold < cost) {
      sound.playWrong();
      return;
    }

    sound.playCoin();
    const newHero: HeroStats = { ...hero, gold: hero.gold - cost };
    if (itemType === 'potion') newHero.potions += 1;
    if (itemType === 'timeFreeze') newHero.timeFreezes += 1;
    if (itemType === 'shield') newHero.shields += 1;
    if (itemType === 'hint5050') newHero.hints5050 += 1;

    saveHero(newHero);
    onUpdateHero(newHero);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col p-4 md:p-6 overflow-y-auto">
      {/* Top Navigation */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between mb-6">
        <button
          onClick={() => { sound.playClick(); onBack(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-sm font-bold border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Peta
        </button>

        {/* Gold & Points Counter */}
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 px-5 py-2 rounded-2xl shadow-lg">
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-inner">
            🪙
          </div>
          <div>
            <span className="text-[10px] text-amber-300 block font-semibold uppercase tracking-wider">Koin Kemenangan</span>
            <span className="text-xl font-black text-amber-400 font-mono tabular-nums">{hero.gold} Poin</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Hero Status Card */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500"></div>

          {/* Hero Avatar & Visual */}
          <div className="my-2">
            <HeroSprite
              heroClass={hero.heroClass}
              appearance={hero.appearance}
              actionState="idle"
              className="scale-90"
            />
          </div>

          <button
            onClick={() => { sound.playClick(); onOpenCustomizer(); }}
            className="mb-3 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Ganti Penampilan</span>
          </button>

          <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-xs font-bold mb-2">
            Tingkat {hero.level} · {hero.heroClass === 'warrior' ? 'Pendekar Pedang' : hero.heroClass === 'mage' ? 'Penyihir Elemen' : hero.heroClass === 'archer' ? 'Pemanah Kilat' : 'Ksatria Perisai'}
          </div>

          <h2 className="text-2xl font-black text-white font-game mb-1">{hero.name}</h2>
          <p className="text-xs text-slate-400 mb-6">Pendekar Penjaga Angka Bilangan Bulat</p>

          {/* Quick Stats Summary */}
          <div className="w-full space-y-2.5 text-xs text-left bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-400" /> Max HP</span>
              <span className="font-mono font-bold text-rose-300">{hero.maxHp} HP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5"><Swords className="w-3.5 h-3.5 text-amber-400" /> Base Attack</span>
              <span className="font-mono font-bold text-amber-300">{hero.baseAtk} DMG</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-sky-400" /> Pertahanan (DEF)</span>
              <span className="font-mono font-bold text-sky-300">{hero.defense}% Tahanan</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-400" /> Kecepatan Jawab</span>
              <span className="font-mono font-bold text-yellow-300">x{hero.speedBonus} Serangan Kilat</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Regenerasi HP</span>
              <span className="font-mono font-bold text-emerald-300">+{hero.regen} HP / Ronde</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Upgrades & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Permanent Attributes Upgrade Section */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-amber-400 font-game flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-400" /> Tempa Atribut Karakter
                </h3>
                <p className="text-xs text-slate-400">
                  Tingkatkan kekuatan permanen hero menggunakan koin hasil menang level
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* ATK Upgrade */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 hover:border-amber-500/40 transition gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Kekuatan Serangan (ATK)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-amber-300 font-mono">
                        Lv {hero.atkUpgradeLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Meningkatkan damage dasar tebasan matematika (+8 DMG). Sekarang: <strong className="text-amber-300">{hero.baseAtk}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradeStat('atk')}
                  disabled={hero.gold < getUpgradeCost(hero.atkUpgradeLevel, 'atk')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>{getUpgradeCost(hero.atkUpgradeLevel, 'atk')} Koin</span>
                </button>
              </div>

              {/* Max HP Upgrade */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 hover:border-rose-500/40 transition gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Kesehatan Maksimum (HP)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-rose-300 font-mono">
                        Lv {hero.hpUpgradeLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Memperbesar darah hero agar tahan serangan boss (+20 HP). Sekarang: <strong className="text-rose-300">{hero.maxHp}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradeStat('hp')}
                  disabled={hero.gold < getUpgradeCost(hero.hpUpgradeLevel, 'hp')}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-md shadow-rose-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>{getUpgradeCost(hero.hpUpgradeLevel, 'hp')} Koin</span>
                </button>
              </div>

              {/* Defense Upgrade */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 hover:border-sky-500/40 transition gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Pertahanan Baja (DEF)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-sky-300 font-mono">
                        Lv {hero.defUpgradeLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Meredam persentase damage monster saat salah jawab (+5%). Sekarang: <strong className="text-sky-300">{hero.defense}%</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradeStat('def')}
                  disabled={hero.defense >= 50 || hero.gold < getUpgradeCost(hero.defUpgradeLevel, 'def')}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-md shadow-sky-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>{hero.defense >= 50 ? 'MAKSIMAL' : `${getUpgradeCost(hero.defUpgradeLevel, 'def')} Koin`}</span>
                </button>
              </div>

              {/* Speed / Crit Multiplier Upgrade */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 hover:border-yellow-500/40 transition gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Refleks Kilat (Speed Bonus)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-yellow-300 font-mono">
                        Lv {hero.speedUpgradeLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Meningkatkan kelipatan damage saat menjawab secepat kilat (+0.2x). Sekarang: <strong className="text-yellow-300">x{hero.speedBonus}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradeStat('speed')}
                  disabled={hero.speedBonus >= 3.0 || hero.gold < getUpgradeCost(hero.speedUpgradeLevel, 'speed')}
                  className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-md shadow-yellow-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>{hero.speedBonus >= 3.0 ? 'MAKSIMAL' : `${getUpgradeCost(hero.speedUpgradeLevel, 'speed')} Koin`}</span>
                </button>
              </div>

              {/* HP Regen Upgrade */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 hover:border-emerald-500/40 transition gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Regenerasi Alkimia</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-emerald-300 font-mono">
                        Lv {hero.regenUpgradeLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Memulihkan HP otomatis setiap menjawab soal (+4 HP/ronde). Sekarang: <strong className="text-emerald-300">+{hero.regen} HP</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradeStat('regen')}
                  disabled={hero.regen >= 24 || hero.gold < getUpgradeCost(hero.regenUpgradeLevel, 'regen')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-md shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>{hero.regen >= 24 ? 'MAKSIMAL' : `${getUpgradeCost(hero.regenUpgradeLevel, 'regen')} Koin`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Consumable Items Store */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-cyan-400 font-game mb-1 flex items-center gap-2">
              <span>🎒</span> Toko Perlengkapan Tempur (Bawa ke Arena)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Gunakan item ini saat dalam pertempuran darurat melawan monster berbahaya!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Potion */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 bg-rose-500/20 rounded-xl border border-rose-500/30">
                    🧪
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">Ramuan Darah (HP)</span>
                    <span className="text-[11px] text-slate-400 block">Pulihkan 35% Darah</span>
                    <span className="text-[10px] text-rose-400 font-semibold">Tersimpan: {hero.potions} buah</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyItem('potion')}
                  disabled={hero.gold < ITEM_COSTS.potion}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-md transition"
                >
                  {ITEM_COSTS.potion} Koin
                </button>
              </div>

              {/* Time Freeze */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                    ⏳
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">Pembeku Waktu</span>
                    <span className="text-[11px] text-slate-400 block">Bekukan waktu 8 detik</span>
                    <span className="text-[10px] text-cyan-400 font-semibold">Tersimpan: {hero.timeFreezes} buah</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyItem('timeFreeze')}
                  disabled={hero.gold < ITEM_COSTS.timeFreeze}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-md transition"
                >
                  {ITEM_COSTS.timeFreeze} Koin
                </button>
              </div>

              {/* Shield */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 bg-sky-500/20 rounded-xl border border-sky-500/30">
                    🛡️
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">Perisai Ajaib</span>
                    <span className="text-[11px] text-slate-400 block">Kebal 1x serangan musuh</span>
                    <span className="text-[10px] text-sky-400 font-semibold">Tersimpan: {hero.shields} buah</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyItem('shield')}
                  disabled={hero.gold < ITEM_COSTS.shield}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-md transition"
                >
                  {ITEM_COSTS.shield} Koin
                </button>
              </div>

              {/* Hint 50:50 */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                    💡
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">Jurus 50:50</span>
                    <span className="text-[11px] text-slate-400 block">Hapus 2 opsi salah</span>
                    <span className="text-[10px] text-yellow-400 font-semibold">Tersimpan: {hero.hints5050} buah</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyItem('hint5050')}
                  disabled={hero.gold < ITEM_COSTS.hint5050}
                  className="px-3 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-md transition"
                >
                  {ITEM_COSTS.hint5050} Koin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
