import React, { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  initialStart?: number;
  initialStep?: number;
}

export const NumberLineVisualizer: React.FC<Props> = ({ initialStart = 0, initialStep = 3 }) => {
  const [start, setStart] = useState<number>(initialStart);
  const [step, setStep] = useState<number>(initialStep);

  const result = start + step;
  const numbers = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <span>📏</span> Simulasi Garis Bilangan Interaktif
        </h4>
        <button
          onClick={() => { setStart(0); setStep(3); }}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <label className="text-slate-400 block mb-1">Titik Awal ({start})</label>
          <input
            type="range"
            min="-10"
            max="10"
            value={start}
            onChange={(e) => setStart(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>-10</span>
            <span>0</span>
            <span>+10</span>
          </div>
        </div>

        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <label className="text-slate-400 block mb-1">
            Langkah: {step > 0 ? `+${step} (Kanan)` : step < 0 ? `${step} (Kiri)` : '0 (Diam)'}
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            value={step}
            onChange={(e) => setStep(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>← Ke Kiri (-)</span>
            <span>Ke Kanan (+) →</span>
          </div>
        </div>
      </div>

      {/* Equation Result Display */}
      <div className="text-center py-2 px-4 mb-4 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-emerald-500/10 border border-slate-700/60 rounded-xl">
        <span className="text-xs text-slate-400 block mb-0.5">Persamaan Matematika:</span>
        <div className="text-lg md:text-xl font-black font-mono tracking-wide text-white flex items-center justify-center gap-2">
          <span className="text-amber-400">{start < 0 ? `(${start})` : start}</span>
          <span className="text-slate-400">{step >= 0 ? '+' : '-'}</span>
          <span className="text-cyan-400">{Math.abs(step)}</span>
          <span className="text-slate-400">=</span>
          <span className={`px-2 py-0.5 rounded-lg font-bold ${result < 0 ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50' : result > 0 ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : 'bg-slate-700 text-amber-300'}`}>
            {result}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 mt-1">
          {step > 0 
            ? `Dari ${start}, melompat ke kanan sebanyak ${step} langkah sampai di ${result}.` 
            : step < 0 
            ? `Dari ${start}, melompat ke kiri sebanyak ${Math.abs(step)} langkah sampai di ${result}.`
            : `Diam di titik ${start}.`}
        </p>
      </div>

      {/* Visual Number Line representation */}
      <div className="relative pt-6 pb-2 px-1 overflow-x-auto">
        <div className="min-w-[420px] relative">
          {/* Main Axis Line */}
          <div className="h-1 bg-slate-600 rounded-full w-full relative top-4"></div>

          {/* Jump Arc if step != 0 */}
          {step !== 0 && (
            <div className="text-center text-[10px] text-cyan-300 font-semibold mb-1 flex items-center justify-center gap-1">
              <span>Lompatan {step > 0 ? `+${step}` : step}</span>
              <ArrowRight className={`w-3 h-3 ${step < 0 ? 'rotate-180' : ''}`} />
            </div>
          )}

          {/* Ticks and Numbers */}
          <div className="flex justify-between items-start relative z-10">
            {numbers.map((n) => {
              const isStart = n === start;
              const isResult = n === result;
              const isZero = n === 0;

              return (
                <div key={n} className="flex flex-col items-center group relative cursor-pointer" onClick={() => setStart(n)}>
                  {/* Indicator Marker */}
                  {isStart && (
                    <div className="absolute -top-6 text-[10px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded shadow">
                      Awal
                    </div>
                  )}
                  {isResult && !isStart && (
                    <div className="absolute -top-6 text-[10px] font-bold bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded shadow animate-bounce">
                      Hasil
                    </div>
                  )}

                  {/* Tick marker */}
                  <div className={`w-0.5 ${isZero ? 'h-5 bg-amber-400' : 'h-3 bg-slate-500'} ${isStart || isResult ? 'h-6 !bg-white' : ''}`}></div>

                  {/* Number Label */}
                  <span className={`text-[10px] font-mono mt-1 ${isZero ? 'text-amber-400 font-bold' : n < 0 ? 'text-rose-400' : 'text-emerald-400'} ${isStart || isResult ? 'font-bold text-white scale-125' : ''}`}>
                    {n}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
