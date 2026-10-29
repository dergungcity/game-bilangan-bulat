import React, { useState, useEffect } from 'react';
import { HeroStats, HeroClass } from '../types/game';
import { HeroSprite } from './GameSprites';
import { sound } from '../utils/audio';
import { saveHero } from '../utils/storage';
import { Play, Sparkles, Volume2, VolumeX, BookOpen, User, RotateCcw, Palette } from 'lucide-react';

interface Props {
  hero: HeroStats;
  onStartGame: () => void;
  onOpenHandbook: () => void;
  onOpenCustomizer: () => void;
  onUpdateHero: (updated: HeroStats) => void;
  onResetProgress: () => void;
}

export const TitleScreen: React.FC<Props> = ({
  hero,
  onStartGame,
  onOpenHandbook,
  onOpenCustomizer,
  onUpdateHero,
  onResetProgress,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(hero.name);

  // Keyboard shortcut listener for Enter / Space to start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingName) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        sound.playClick();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditingName, onStartGame]);

  const handleSelectClass = (cls: HeroClass) => {
    sound.playClick();
    const updated: HeroStats = {
      ...hero,
      heroClass: cls,
      name: tempName.trim() || hero.name,
    };
    saveHero(updated);
    onUpdateHero(updated);
  };

  const handleSaveName = () => {
    sound.playClick();
    const updated = { ...hero, name: tempName.trim() || 'Pendekar' };
    saveHero(updated);
    onUpdateHero(updated);
    setIsEditingName(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      
      {/* Background Animated Atmosphere: Floating glowing math particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/6 text-5xl font-mono text-cyan-400 animate-float-slow">
          -12
        </div>
        <div className="absolute top-1/3 right-1/5 text-6xl font-mono text-amber-400 animate-float-delayed">
          +25
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-4xl font-mono text-rose-400 animate-float-slow">
          (-8) × 6
        </div>
        <div className="absolute bottom-1/3 right-1/3 text-5xl font-mono text-purple-400 animate-float-delayed">
          (-(-7)) = +7
        </div>
        <div className="absolute top-1/2 left-2/3 text-4xl font-mono text-emerald-400 animate-float-slow">
          0 &gt; -15
        </div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Bar Status / Mute / Handbook */}
      <div className="relative z-10 p-4 md:p-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono tracking-wider">
            EDUKASI MATEMATIKA KELAS 6 SD
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { sound.playClick(); onOpenCustomizer(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 transition text-xs font-bold"
          >
            <Palette className="w-4 h-4 text-purple-300" />
            <span>Kustom Karakter</span>
          </button>
          <button
            onClick={() => { sound.playClick(); onOpenHandbook(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700 transition text-xs font-bold"
          >
            <BookOpen className="w-4 h-4" />
            <span>Kitab Rumus</span>
          </button>
          <button
            onClick={() => setIsMuted(sound.toggleMute())}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Toggle Suara"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Centerpiece: Bespoke Title Lockup & Hero Presentation */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 text-center max-w-4xl mx-auto w-full">
        
        {/* Bespoke Inline SVG Title Lockup */}
        <div className="mb-3">
          <svg viewBox="0 0 600 130" className="w-full max-w-md md:max-w-xl mx-auto drop-shadow-[0_10px_20px_rgba(245,158,11,0.3)]">
            <defs>
              <linearGradient id="titleGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="subTitleCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>

            {/* Glowing Backdrop Banner */}
            <path d="M50 35 L550 35 L520 85 L80 85 Z" fill="#1e1b4b" opacity="0.6" stroke="#4338ca" strokeWidth="2" />
            
            {/* Top Text: MATH QUEST */}
            <text
              x="300"
              y="55"
              textAnchor="middle"
              fill="url(#titleGold)"
              fontFamily="Fredoka, sans-serif"
              fontSize="36"
              fontWeight="900"
              letterSpacing="3"
            >
              MATH QUEST
            </text>

            {/* Sub Banner Text: PENDEKAR BILANGAN BULAT */}
            <text
              x="300"
              y="80"
              textAnchor="middle"
              fill="url(#subTitleCyan)"
              fontFamily="Fredoka, sans-serif"
              fontSize="18"
              fontWeight="800"
              letterSpacing="4"
            >
              PENDEKAR BILANGAN BULAT
            </text>

            {/* Decorative Swords */}
            <text x="75" y="65" textAnchor="middle" fontSize="24">⚔️</text>
            <text x="525" y="65" textAnchor="middle" fontSize="24">⚔️</text>
          </svg>
        </div>

        <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto mb-4">
          Kalahkan monster di setiap level dengan menjawab soal matematika bilangan bulat secepat kilat! Tingkatkan statistik hero dan jadilah Pendekar Terkuat!
        </p>

        {/* Hero Character Card & Customization */}
        <div className="bg-slate-900/90 border-2 border-slate-800 p-4 md:p-5 rounded-3xl shadow-2xl max-w-md w-full mb-5">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Karakter Kamu</span>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <button onClick={handleSaveName} className="text-amber-400 font-bold hover:underline">
                  Simpan Nama
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 hover:text-amber-400 flex items-center gap-1 font-semibold"
                >
                  <User className="w-3.5 h-3.5" /> Ganti Nama
                </button>
              )}
            </div>
          </div>

          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              maxLength={15}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full bg-slate-800 border-2 border-amber-500 rounded-xl px-3 py-1.5 text-white font-bold text-center mb-2.5 text-sm focus:outline-none"
              placeholder="Masukkan nama hero"
              autoFocus
            />
          ) : (
            <h3 className="text-xl font-black text-amber-300 font-game mb-1">{hero.name}</h3>
          )}

          {/* Hero Class Selector Tabs */}
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {[
              { id: 'warrior', label: '⚔️ Pedang' },
              { id: 'mage', label: '🔮 Penyihir' },
              { id: 'archer', label: '🏹 Pemanah' },
              { id: 'paladin', label: '🛡️ Ksatria' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectClass(c.id as HeroClass)}
                className={`p-1.5 rounded-xl border text-[11px] font-bold transition flex items-center justify-center ${
                  hero.heroClass === c.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Sprite Preview */}
          <div className="flex justify-center items-center py-1">
            <HeroSprite
              heroClass={hero.heroClass}
              appearance={hero.appearance}
              actionState="idle"
              className="scale-90"
            />
          </div>

          {/* Button to open full appearance customizer */}
          <button
            onClick={() => { sound.playClick(); onOpenCustomizer(); }}
            className="w-full mt-2 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Modifikasi Penampilan Lengkap (Rambut, Baju, Senjata)</span>
          </button>
        </div>

        {/* Primary Start CTA Button */}
        <button
          onClick={() => { sound.playClick(); onStartGame(); }}
          className="group relative px-8 md:px-12 py-3.5 md:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-base md:text-lg uppercase tracking-wider transition transform hover:scale-105 active:scale-95 shadow-2xl shadow-amber-500/30 flex items-center gap-3 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>Mulai Petualangan</span>
          <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
        </button>

      </div>

      {/* Bottom Flat Control Hint Line */}
      <div className="relative z-10 p-4 bg-slate-950/80 border-t border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 max-w-6xl mx-auto w-full">
        <div>
          <span>Petunjuk Kontrol: </span>
          <strong className="text-slate-300">Klik Pilihan Jawaban · Enter / Spasi Mulai · Esc Jeda</strong>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button
            onClick={() => {
              if (confirm('Apakah kamu yakin ingin mereset seluruh progres dan kembali ke awal?')) {
                onResetProgress();
              }
            }}
            className="hover:text-rose-400 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" /> Reset Progres
          </button>
          <span>v1.1.0 Kelas 6 SD</span>
        </div>
      </div>

    </div>
  );
};
