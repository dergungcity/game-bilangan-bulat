import React from 'react';
import { HeroStats } from '../types/game';
import { X, Award, Printer, CheckCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  hero: HeroStats;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({ hero, isOpen, onClose }) => {
  if (!isOpen) return null;

  const totalStars = Object.values(hero.levelStars).reduce((a, b) => a + b, 0);
  const isAllCleared = hero.unlockedLevel >= 6 && (hero.levelStars[6] || 0) > 0;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-amber-50 border-8 border-amber-600 rounded-3xl p-6 md:p-8 text-slate-900 shadow-2xl flex flex-col items-center text-center overflow-hidden print:border-4 print:shadow-none print:w-full">
        
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-slate-800 transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Watermark / Header */}
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-8 h-8 text-amber-600" />
          <span className="text-xs font-black tracking-widest uppercase text-amber-800">
            KEMENTERIAN PETUALANGAN MATEMATIKA
          </span>
          <Award className="w-8 h-8 text-amber-600" />
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-amber-900 font-serif tracking-wide uppercase mb-1">
          Piagam Penghargaan
        </h1>
        <p className="text-xs text-amber-800 italic mb-4">
          Diberikan sebagai bukti kelulusan &amp; penguasaan kompetensi matematika bilangan bulat:
        </p>

        {/* Hero Name Lockup */}
        <div className="w-full border-b-2 border-amber-500/60 pb-2 mb-4">
          <span className="text-2xl md:text-3xl font-black text-slate-900 font-game underline decoration-amber-500 decoration-wavy">
            {hero.name}
          </span>
          <span className="block text-xs font-bold text-amber-700 mt-1">
            {hero.heroClass === 'warrior' && 'Pendekar Pedang Api'}
            {hero.heroClass === 'mage' && 'Penyihir Kristal Es'}
            {hero.heroClass === 'archer' && 'Pemanah Kilat'}
            {hero.heroClass === 'paladin' && 'Ksatria Perisai Emas'}
            {' · '}Siswa Kelas 6 Sekolah Dasar
          </span>
        </div>

        <p className="text-xs text-slate-700 max-w-lg mb-4 leading-relaxed">
          Telah berhasil menaklukkan monster kegelapan di setiap medan ujian serta membuktikan kemahiran penuh dalam seluruh materi kurikulum <strong>Bilangan Bulat Kelas 6 SD</strong>:
        </p>

        {/* Mastered Competencies Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-[11px] font-semibold text-slate-800 mb-6 bg-amber-100/70 p-3 rounded-2xl border border-amber-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Garis Bilangan &amp; Perbandingan (+ &amp; -)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Penjumlahan &amp; Konsep Uang-Hutang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Pengurangan &amp; Rumus -(-a) = +a</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Perkalian &amp; Pembagian Tanda Positif/Negatif</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Urutan Operasi Campuran (KaBaTaKu)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Soal Cerita Suhu, Laut &amp; Lift Gedung</span>
          </div>
        </div>

        {/* Certificate Seal & Stats */}
        <div className="w-full flex items-center justify-between border-t border-amber-300 pt-3 text-xs">
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-500 block">STATUS PRESTASI</span>
            <span className="font-bold text-amber-900">
              {totalStars} Bintang Diraih · Tingkat {hero.level}
            </span>
          </div>

          {/* Golden Seal */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-yellow-200 flex flex-col items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 text-yellow-100" />
            <span className="text-[8px] font-black tracking-tighter">LULUS RESMI</span>
            <span className="text-[7px]">KELAS 6</span>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-500 block">GELAR AKHIR</span>
            <span className="font-bold text-amber-900">
              {isAllCleared ? 'Pendekar Agung Nol' : 'Pendekar Pelajar'}
            </span>
          </div>
        </div>

        {/* Action Controls (Hidden when printed) */}
        <div className="mt-6 flex items-center gap-3 w-full print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
