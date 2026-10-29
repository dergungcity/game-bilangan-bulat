import React from 'react';
import { RotateCcw, Swords, BookOpen, MapPin } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  levelTitle: string;
  monsterName: string;
  onRetry: () => void;
  onOpenUpgrade: () => void;
  onOpenHandbook: () => void;
  onBackToMap: () => void;
}

export const DefeatModal: React.FC<Props> = ({
  levelTitle,
  monsterName,
  onRetry,
  onOpenUpgrade,
  onOpenHandbook,
  onBackToMap,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 md:p-8 text-center text-white shadow-2xl overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-16 inset-x-0 h-32 bg-rose-500/20 rounded-full blur-2xl"></div>

        <div className="text-4xl mb-2">🛡️</div>

        <h2 className="text-2xl font-black text-rose-400 font-game mb-1">
          Pertahananmu Tertembus!
        </h2>
        <p className="text-xs text-slate-300 mb-6">
          <strong className="text-white">{monsterName}</strong> di {levelTitle} cukup tangguh. Jangan patah semangat!
        </p>

        {/* Actionable Tips Box */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-6 text-left text-xs space-y-2">
          <span className="font-bold text-amber-400 block mb-1">💡 Tips Sukses Pendekar:</span>
          <p className="text-slate-300 flex items-start gap-2">
            <span>•</span>
            <span>Tingkatkan <strong>Max HP &amp; Pertahanan (DEF)</strong> di Toko Peningkatan agar tidak mudah kalah saat salah menjawab.</span>
          </p>
          <p className="text-slate-300 flex items-start gap-2">
            <span>•</span>
            <span>Gunakan item <strong>Jam Pembeku Waktu</strong> atau <strong>Perisai</strong> untuk perlindungan darurat.</span>
          </p>
          <p className="text-slate-300 flex items-start gap-2">
            <span>•</span>
            <span>Buka <strong>Kitab Rumus</strong> untuk mengingat aturan tanda minus (-) dan KaBaTaKu!</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => { sound.playClick(); onRetry(); }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Lagi Pertarungan</span>
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenUpgrade(); }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4" />
            <span>Tingkatkan Karakter Dulu</span>
          </button>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { sound.playClick(); onOpenHandbook(); }}
              className="flex-1 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition flex items-center justify-center gap-1 border border-slate-700"
            >
              <BookOpen className="w-3.5 h-3.5" /> Buka Rumus
            </button>
            <button
              onClick={() => { sound.playClick(); onBackToMap(); }}
              className="flex-1 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1 border border-slate-700"
            >
              <MapPin className="w-3.5 h-3.5" /> Peta Level
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
