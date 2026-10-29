import React, { useState } from 'react';
import { BookOpen, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { NumberLineVisualizer } from './NumberLineVisualizer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BukuPanduanModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'garis' | 'tambah_kurang' | 'kali_bagi' | 'kabataku' | 'cerita'>('garis');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-amber-400 font-game">
                Kitab Jurus Bilangan Bulat
              </h2>
              <p className="text-xs text-slate-300">
                Panduan Resmi Matematika Kelas 6 SD & Rahasia Mengalahkan Monster
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 px-6 py-2.5 bg-slate-800/40 border-b border-slate-700/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('garis')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'garis'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📏 Garis Bilangan
          </button>
          <button
            onClick={() => setActiveTab('tambah_kurang')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'tambah_kurang'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ➕➖ Tambah & Kurang
          </button>
          <button
            onClick={() => setActiveTab('kali_bagi')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'kali_bagi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ✖️➗ Kali & Bagi
          </button>
          <button
            onClick={() => setActiveTab('kabataku')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'kabataku'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            👑 KaBaTaKu
          </button>
          <button
            onClick={() => setActiveTab('cerita')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'cerita'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🗺️ Soal Cerita
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm leading-relaxed">
          {activeTab === 'garis' && (
            <div className="space-y-4">
              <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700">
                <h3 className="font-bold text-amber-400 text-base mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Apa itu Bilangan Bulat?
                </h3>
                <p className="text-slate-300 mb-2">
                  Bilangan bulat terdiri dari tiga bagian penting:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                  <div className="bg-rose-500/20 border border-rose-500/40 p-2 rounded-xl text-rose-300">
                    <span className="block text-sm font-bold">Bilangan Negatif</span>
                    ..., -3, -2, -1
                  </div>
                  <div className="bg-amber-500/20 border border-amber-500/40 p-2 rounded-xl text-amber-300">
                    <span className="block text-sm font-bold">Nol (0)</span>
                    Titik Pusat
                  </div>
                  <div className="bg-emerald-500/20 border border-emerald-500/40 p-2 rounded-xl text-emerald-300">
                    <span className="block text-sm font-bold">Bilangan Positif</span>
                    1, 2, 3, ...
                  </div>
                </div>
              </div>

              {/* Number line visualizer */}
              <NumberLineVisualizer initialStart={-3} initialStep={5} />

              <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 space-y-2">
                <h4 className="font-bold text-amber-300 text-sm">💡 Kunci Rahasia Garis Bilangan:</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Semakin ke KANAN</strong>, nilainya <strong>semakin BESAR</strong>. Contoh: 2 &gt; -5.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Semakin ke KIRI</strong>, nilainya <strong>semakin KECIL</strong>. Contoh: -10 &lt; -3.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Lawan Bilangan:</strong> Lawan dari 7 adalah -7. Lawan dari -15 adalah 15.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tambah_kurang' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-sky-950/60 to-indigo-950/60 p-4 rounded-2xl border border-sky-500/40">
                <h3 className="font-bold text-sky-300 text-base mb-2">
                  🧠 Jurus Uang &amp; Hutang (Penjumlahan)
                </h3>
                <p className="text-xs text-slate-300 mb-3">
                  Anggap bilangan <strong>POSITIF</strong> sebagai uang saku, dan bilangan <strong>NEGATIF</strong> sebagai hutang jajan.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="font-bold text-emerald-400 block mb-1">(-7) + 12 = 5</span>
                    <p className="text-slate-300">Punya hutang 7, lalu dibayar uang 12. Uang tersisa 5!</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="font-bold text-rose-400 block mb-1">(-10) + (-5) = -15</span>
                    <p className="text-slate-300">Hutang 10 berhutang lagi 5. Total hutang makin membengkak jadi 15!</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-950/60 to-pink-950/60 p-4 rounded-2xl border border-purple-500/40">
                <h3 className="font-bold text-pink-300 text-base mb-2">
                  ✨ Rahasia Ajaib: Minus Bertemu Minus Menjadi Tambah!
                </h3>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-pink-500/30 text-center font-mono text-sm md:text-base font-bold text-pink-300 mb-3">
                  a - (-b) = a + b
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="bg-slate-800/70 p-2.5 rounded-lg">
                    <strong>Contoh 1:</strong> 15 - (-8) = 15 + 8 = <span className="text-emerald-400 font-bold">23</span>
                  </div>
                  <div className="bg-slate-800/70 p-2.5 rounded-lg">
                    <strong>Contoh 2:</strong> (-12) - (-20) = -12 + 20 = 20 - 12 = <span className="text-emerald-400 font-bold">8</span>
                  </div>
                  <div className="bg-slate-800/70 p-2.5 rounded-lg">
                    <strong>Contoh 3:</strong> (-8) - 10 = -8 + (-10) = <span className="text-rose-400 font-bold">-18</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kali_bagi' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-amber-500/40">
                <h3 className="font-bold text-amber-400 text-base mb-2">
                  ⚡ Hukum Tanda Perkalian &amp; Pembagian
                </h3>
                <p className="text-xs text-slate-300 mb-3">
                  Sangat mudah dihafal: <strong>Tanda SAMA hasilnya POSITIF</strong>, <strong>Tanda BEDA hasilnya NEGATIF</strong>!
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl space-y-2">
                    <span className="font-bold text-emerald-400 block border-b border-emerald-500/20 pb-1">
                      🟢 TANDA SAMA → POSITIF (+)
                    </span>
                    <p>(+) × (+) = <strong>(+)</strong> → 6 × 7 = 42</p>
                    <p><strong>(-) × (-) = (+)</strong> → (-8) × (-5) = 40</p>
                    <p>(-) : (-) = <strong>(+)</strong> → (-72) : (-8) = 9</p>
                  </div>

                  <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl space-y-2">
                    <span className="font-bold text-rose-400 block border-b border-rose-500/20 pb-1">
                      🔴 TANDA BEDA → NEGATIF (-)
                    </span>
                    <p>(+) × (-) = <strong>(-)</strong> → 9 × (-4) = -36</p>
                    <p>(-) × (+) = <strong>(-)</strong> → (-7) × 6 = -42</p>
                    <p>(+) : (-) = <strong>(-)</strong> → 64 : (-8) = -8</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kabataku' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-yellow-500/40">
                <h3 className="font-bold text-yellow-400 text-base mb-1">
                  👑 Mahkota KaBaTaKu (Urutan Operasi)
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  Jangan langsung menghitung dari kiri ke kanan! Ikuti tingkat kekuasaan berikut:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-3 bg-yellow-500/20 border border-yellow-500/40 p-2.5 rounded-xl font-bold text-yellow-300">
                    <span className="text-lg">1️⃣</span>
                    <span>Tanda Kurung ( ... )</span>
                    <span className="text-[11px] text-yellow-200 ml-auto font-normal">Paling Utama</span>
                  </div>
                  <div className="flex items-center gap-3 bg-sky-500/20 border border-sky-500/40 p-2.5 rounded-xl font-bold text-sky-300">
                    <span className="text-lg">2️⃣</span>
                    <span>Kali (×) dan Bagi (:)</span>
                    <span className="text-[11px] text-sky-200 ml-auto font-normal">Sama kuat, dari kiri</span>
                  </div>
                  <div className="flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/40 p-2.5 rounded-xl font-bold text-emerald-300">
                    <span className="text-lg">3️⃣</span>
                    <span>Tambah (+) dan Kurang (-)</span>
                    <span className="text-[11px] text-emerald-200 ml-auto font-normal">Terakhir, dari kiri</span>
                  </div>
                </div>

                <div className="mt-4 bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
                  <span className="text-amber-400 font-bold block">Contoh: (-10) + 5 × (-4)</span>
                  <p className="text-slate-300">1. Kalikan dulu: 5 × (-4) = -20</p>
                  <p className="text-slate-300">2. Lalu jumlahkan: (-10) + (-20) = <strong className="text-rose-400">-30</strong></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cerita' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-emerald-500/40">
                <h3 className="font-bold text-emerald-400 text-base mb-2">
                  🗺️ Kata Kunci Soal Cerita Dunia Nyata
                </h3>
                <p className="text-xs text-slate-300 mb-3">
                  Siswa kelas 6 sering menjumpai soal tentang suhu, kedalaman laut, lift, dan selisih:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                    <span className="font-bold text-cyan-400 block mb-1">🌡️ Suhu &amp; Termometer</span>
                    <ul className="text-slate-300 space-y-1">
                      <li>• Di atas nol / naik = (+) Positif</li>
                      <li>• Di bawah nol / beku / turun = (-) Negatif</li>
                      <li>• <em>Selisih suhu</em> = Suhu tertinggi - Suhu terendah</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                    <span className="font-bold text-indigo-400 block mb-1">🌊 Kedalaman Laut &amp; Lift</span>
                    <ul className="text-slate-300 space-y-1">
                      <li>• Terbang di atas permukaan = (+) Positif</li>
                      <li>• Menyelam di bawah laut = (-) Negatif</li>
                      <li>• Basement / parkir bawah tanah = (-) Negatif (B2 = -2)</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs">
                  <span className="font-bold text-emerald-300 block mb-1">Contoh Jarak Burung &amp; Ikan:</span>
                  <p className="text-slate-200">
                    Burung di ketinggian 15 m (+15), ikan di kedalaman 8 m (-8).
                    <br />
                    Jarak = 15 - (-8) = 15 + 8 = <strong>23 meter</strong>!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
          >
            Siap Bertarung!
          </button>
        </div>
      </div>
    </div>
  );
};
