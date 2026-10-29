import React from 'react';
import { HeroStats, LevelInfo } from '../types/game';
import { GAME_LEVELS } from '../data/monsters';
import { sound } from '../utils/audio';
import { Swords, Lock, Star, Sparkles, BookOpen, Volume2, VolumeX, Award, Shield, Zap, Palette } from 'lucide-react';

interface Props {
  hero: HeroStats;
  onSelectLevel: (level: LevelInfo) => void;
  onOpenUpgrade: () => void;
  onOpenHandbook: () => void;
  onOpenCertificate: () => void;
  onOpenCustomizer: () => void;
  onStartEndless: () => void;
}

export const MapScreen: React.FC<Props> = ({
  hero,
  onSelectLevel,
  onOpenUpgrade,
  onOpenHandbook,
  onOpenCertificate,
  onOpenCustomizer,
  onStartEndless,
}) => {
  const isMuted = sound.getMuted();

  const handleToggleSound = () => {
    sound.toggleMute();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col p-4 md:p-6 overflow-y-auto">
      {/* Top Header Navigation */}
      <div className="max-w-6xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-xl backdrop-blur-md">
        
        {/* Hero Quick Badge (Clickable to customize) */}
        <div
          onClick={() => { sound.playClick(); onOpenCustomizer(); }}
          className="flex items-center gap-3 cursor-pointer group bg-slate-800/40 hover:bg-slate-800/80 p-1.5 pr-3 rounded-2xl border border-slate-700/60 transition"
          title="Klik untuk mengubah nama dan penampilan hero"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-xl font-bold border-2 border-amber-400 shadow-md group-hover:scale-105 transition">
            {hero.heroClass === 'warrior' ? '⚔️' : hero.heroClass === 'mage' ? '🔮' : hero.heroClass === 'archer' ? '🏹' : '🛡️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white font-game text-base md:text-lg group-hover:text-amber-300 transition flex items-center gap-1">
                {hero.name} <Palette className="w-3.5 h-3.5 text-purple-400 opacity-80" />
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                Tingkat {hero.level}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {hero.heroClass === 'warrior' && 'Pendekar Pedang Api'}
              {hero.heroClass === 'mage' && 'Penyihir Kristal Es'}
              {hero.heroClass === 'archer' && 'Pemanah Kilat'}
              {hero.heroClass === 'paladin' && 'Ksatria Perisai Emas'}
              {' · '}
              <span className="text-purple-400 underline font-semibold">Ganti Tampilan</span>
            </p>
          </div>
        </div>

        {/* Currency & Quick Hub Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Gold Counter */}
          <div
            onClick={() => { sound.playClick(); onOpenUpgrade(); }}
            className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl cursor-pointer hover:bg-amber-500/20 transition shadow"
            title="Klik untuk membuka Toko Peningkatan Karakter"
          >
            <span className="text-base">🪙</span>
            <div>
              <span className="text-[9px] text-amber-300 block font-semibold leading-none">POIN</span>
              <span className="text-sm font-black text-amber-400 font-mono tabular-nums leading-tight">{hero.gold}</span>
            </div>
          </div>

          {/* Upgrade Button */}
          <button
            onClick={() => { sound.playClick(); onOpenUpgrade(); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
          >
            <Swords className="w-4 h-4" />
            <span>Peningkatan Hero</span>
          </button>

          {/* Handbook Button */}
          <button
            onClick={() => { sound.playClick(); onOpenHandbook(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Kitab Rumus</span>
          </button>

          {/* Certificate Button */}
          <button
            onClick={() => { sound.playClick(); onOpenCertificate(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 transition"
            title="Piagam Kelulusan"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Suara"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* World Map Header */}
      <div className="max-w-6xl mx-auto w-full mb-6 text-center">
        <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest mb-1.5">
          Peta Petualangan Kerajaan Angka
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-white font-game">
          Pilih Medan Pertarungan Monster
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
          Setiap level menguji materi bilangan bulat yang berbeda. Taklukkan monster untuk mengumpulkan koin &amp; meningkatkan kekuatan karaktermu!
        </p>
      </div>

      {/* Level Selection Cards Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {GAME_LEVELS.map((lvl) => {
          const isUnlocked = lvl.levelNumber <= hero.unlockedLevel;
          const stars = hero.levelStars[lvl.levelNumber] || 0;

          return (
            <div
              key={lvl.levelNumber}
              onClick={() => {
                if (isUnlocked) {
                  sound.playClick();
                  onSelectLevel(lvl);
                } else {
                  sound.playWrong();
                }
              }}
              className={`relative rounded-3xl p-5 border-2 transition transform duration-200 flex flex-col justify-between overflow-hidden shadow-xl ${
                isUnlocked
                  ? 'bg-slate-900/90 border-slate-700 hover:border-amber-400 hover:-translate-y-1 cursor-pointer'
                  : 'bg-slate-950/60 border-slate-800 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Top Level Banner */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono ${
                  isUnlocked ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-500'
                }`}>
                  Level {lvl.levelNumber}
                </span>

                {/* Stars earned */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-4 h-4 ${
                        starIdx <= stars
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Monster & Stage Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-slate-700 shadow-md shrink-0"
                    style={{ backgroundColor: `${lvl.monster.colorTheme.primary}20` }}
                  >
                    {lvl.levelNumber === 1 && '🟢'}
                    {lvl.levelNumber === 2 && '❄️'}
                    {lvl.levelNumber === 3 && '🐺'}
                    {lvl.levelNumber === 4 && '🔥'}
                    {lvl.levelNumber === 5 && '🛡️'}
                    {lvl.levelNumber === 6 && '👑'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white font-game text-base leading-snug">
                      {lvl.title}
                    </h3>
                    <p className="text-xs text-amber-400 font-semibold">
                      Boss: {lvl.monster.name}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 text-xs space-y-1">
                  <div className="text-slate-300 font-medium">
                    📖 <span className="text-slate-400">Materi:</span> {lvl.topic}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    {lvl.description}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-amber-400 font-bold flex items-center gap-1">
                  <span>🪙</span>
                  <span>+{lvl.monster.goldReward} Poin</span>
                </div>

                {isUnlocked ? (
                  <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1 shadow-md shadow-amber-500/20">
                    <Swords className="w-3.5 h-3.5" />
                    <span>Lawan Monster</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-slate-500 font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Terkunci</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Endless Challenge Banner */}
      <div className="max-w-6xl mx-auto w-full bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-2xl text-purple-400 text-3xl">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-black text-purple-300 font-game">
                Arena Tantangan Abadi (Endless Mode)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                Latihan Bebas
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Uji ketahananmu menghadapi gelombang soal acak dari seluruh kategori bilangan bulat kelas 6! Cetak rekor kombo dan kumpulkan poin tanpa batas!
            </p>
          </div>
        </div>

        <button
          onClick={() => { sound.playClick(); onStartEndless(); }}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/30 shrink-0"
        >
          Masuk Arena Abadi
        </button>
      </div>

    </div>
  );
};
