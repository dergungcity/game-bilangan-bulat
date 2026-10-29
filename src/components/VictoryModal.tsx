import React from 'react';
import { Star, Swords, ArrowRight, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  levelNumber: number;
  levelTitle: string;
  monsterName: string;
  stars: number;
  earnedGold: number;
  earnedExp: number;
  damageDealt: number;
  onNextLevel: () => void;
  onOpenUpgrade: () => void;
  onRetry: () => void;
  onBackToMap: () => void;
}

export const VictoryModal: React.FC<Props> = ({
  levelNumber,
  levelTitle,
  monsterName,
  stars,
  earnedGold,
  earnedExp,
  damageDealt,
  onNextLevel,
  onOpenUpgrade,
  onRetry,
  onBackToMap,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 md:p-8 text-center text-white shadow-2xl overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-16 inset-x-0 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>

        {/* Victory Badge */}
        <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider mb-2">
          Kemenangan Gemilang!
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-amber-400 font-game mb-1">
          Monster Berhasil Ditaklukkan!
        </h2>
        <p className="text-xs text-slate-300 mb-6">
          Kamu telah mengalahkan <strong className="text-white">{monsterName}</strong> di {levelTitle}!
        </p>

        {/* Star Rating Animation */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transform transition duration-500 ${
                starIdx <= stars ? 'scale-125 text-yellow-400 animate-bounce' : 'text-slate-700'
              }`}
            >
              <Star className="w-9 h-9 fill-current filter drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]" />
            </div>
          ))}
        </div>

        {/* Rewards Earned Box */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-3 text-left">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-semibold">POIN DIDAPATKAN</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg">🪙</span>
              <span className="text-xl font-black text-amber-400 font-mono">+{earnedGold}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-semibold">TOTAL KERUSAKAN</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg">💥</span>
              <span className="text-xl font-black text-rose-400 font-mono">{damageDealt} DMG</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {levelNumber < 6 ? (
            <button
              onClick={() => { sound.playClick(); onNextLevel(); }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Level {levelNumber + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => { sound.playClick(); onBackToMap(); }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <span>Semua Level Selesai! Kembali ke Peta</span>
            </button>
          )}

          <button
            onClick={() => { sound.playClick(); onOpenUpgrade(); }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4" />
            <span>Gunakan Poin di Toko Peningkatan</span>
          </button>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { sound.playClick(); onRetry(); }}
              className="flex-1 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ulangi Level
            </button>
            <button
              onClick={() => { sound.playClick(); onBackToMap(); }}
              className="flex-1 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition"
            >
              Peta Level
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
