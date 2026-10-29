import React, { useState } from 'react';
import { HeroStats, HeroClass, HeroAppearance } from '../types/game';
import { HeroSprite } from './GameSprites';
import { sound } from '../utils/audio';
import { X, Check, Sparkles, User, Palette, Shield, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  hero: HeroStats;
  onSave: (updatedHero: HeroStats) => void;
  onClose: () => void;
}

export const CharacterCustomizerModal: React.FC<Props> = ({
  isOpen,
  hero,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState<string>(hero.name);
  const [heroClass, setHeroClass] = useState<HeroClass>(hero.heroClass);
  const [appearance, setAppearance] = useState<HeroAppearance>({ ...hero.appearance });
  const [activeTab, setActiveTab] = useState<'class' | 'hair' | 'outfit' | 'gear'>('class');

  if (!isOpen) return null;

  const handleClassChange = (newClass: HeroClass) => {
    sound.playClick();
    setHeroClass(newClass);
    // Suggest matching weapon and gear defaults
    if (newClass === 'mage') {
      setAppearance((prev) => ({ ...prev, weaponType: 'staff', headgear: 'wizard_hat', aura: 'frost' }));
    } else if (newClass === 'archer') {
      setAppearance((prev) => ({ ...prev, weaponType: 'bow', headgear: 'headband', aura: 'lightning' }));
    } else if (newClass === 'paladin') {
      setAppearance((prev) => ({ ...prev, weaponType: 'spear', headgear: 'knight_helm', aura: 'cosmic' }));
    } else {
      setAppearance((prev) => ({ ...prev, weaponType: 'sword', headgear: 'headband', aura: 'flame' }));
    }
  };

  const handleSave = () => {
    sound.playUpgrade();
    const finalHero: HeroStats = {
      ...hero,
      name: name.trim() || 'Pendekar',
      heroClass,
      appearance,
    };
    onSave(finalHero);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-white">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Live Character Preview & Name Input */}
        <div className="w-full md:w-5/12 bg-slate-950/90 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Pratinjau Karakter
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">
              Tingkat {hero.level}
            </span>
          </div>

          {/* Sprite Live View */}
          <div className="my-auto py-2 flex flex-col items-center">
            <HeroSprite
              heroClass={heroClass}
              appearance={appearance}
              actionState="idle"
              className="scale-105"
            />
            <div className="mt-2 text-center">
              <h3 className="text-xl font-black text-amber-300 font-game">{name || 'Nama Hero'}</h3>
              <p className="text-xs text-slate-400 font-semibold">
                {heroClass === 'warrior' && '⚔️ Pendekar Pedang Api'}
                {heroClass === 'mage' && '🔮 Penyihir Kristal Es'}
                {heroClass === 'archer' && '🏹 Pemanah Petir Halilintar'}
                {heroClass === 'paladin' && '🛡️ Ksatria Perisai Emas'}
              </p>
            </div>
          </div>

          {/* Name Customization Input */}
          <div className="w-full mt-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" /> Nama Pendekar:
            </label>
            <input
              type="text"
              value={name}
              maxLength={16}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none"
              placeholder="Contoh: Arya, Maya, Bintang..."
            />
          </div>
        </div>

        {/* Right Side: Customization Options & Tabs */}
        <div className="w-full md:w-7/12 flex flex-col justify-between p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-xl font-black text-white font-game flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" /> Modifikasi Penampilan
              </h2>
              <p className="text-xs text-slate-400">
                Pilih gaya, busana, senjata, dan efek visual sesukamu!
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Tabs */}
          <div className="grid grid-cols-4 gap-1.5 mb-4 bg-slate-800/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('class')}
              className={`py-1.5 rounded-lg transition ${activeTab === 'class' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'}`}
            >
              Kelas
            </button>
            <button
              onClick={() => setActiveTab('hair')}
              className={`py-1.5 rounded-lg transition ${activeTab === 'hair' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'}`}
            >
              Rambut &amp; Kulit
            </button>
            <button
              onClick={() => setActiveTab('outfit')}
              className={`py-1.5 rounded-lg transition ${activeTab === 'outfit' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'}`}
            >
              Zirah &amp; Warna
            </button>
            <button
              onClick={() => setActiveTab('gear')}
              className={`py-1.5 rounded-lg transition ${activeTab === 'gear' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'}`}
            >
              Senjata &amp; Aura
            </button>
          </div>

          {/* TAB 1: HERO CLASS */}
          {activeTab === 'class' && (
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              <span className="text-xs text-slate-400 font-bold block">Pilih Profesi / Kelas Petarung:</span>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'warrior', label: 'Pendekar Pedang', icon: '⚔️', desc: 'Fokus serangan fisik & tebasan seimbang' },
                  { id: 'mage', label: 'Penyihir Elemen', icon: '🔮', desc: 'Kekuatan magis & refleks cepat' },
                  { id: 'archer', label: 'Pemanah Kilat', icon: '🏹', desc: 'Kecepatan tinggi & akurasi tajam' },
                  { id: 'paladin', label: 'Ksatria Perisai', icon: '🛡️', desc: 'Pertahanan kokoh & daya tahan ekstra' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleClassChange(c.id as HeroClass)}
                    className={`p-3 rounded-2xl border-2 text-left transition ${
                      heroClass === c.id
                        ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{c.icon}</div>
                    <div className="font-bold text-sm text-white">{c.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HAIR & SKIN */}
          {activeTab === 'hair' && (
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
              {/* Skin Tone */}
              <div>
                <span className="text-slate-400 font-bold block mb-1.5">Warna Kulit:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', label: 'Kuning Langsat', color: '#fcd34d' },
                    { id: 'tan', label: 'Sawo Matang', color: '#f59e0b' },
                    { id: 'warm', label: 'Hangat / Eksotis', color: '#d97706' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { sound.playClick(); setAppearance((prev) => ({ ...prev, skinTone: s.id as any })); }}
                      className={`p-2 rounded-xl border flex items-center gap-2 ${
                        appearance.skinTone === s.id ? 'border-amber-400 bg-amber-500/20 font-bold' : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-white/40" style={{ backgroundColor: s.color }}></span>
                      <span className="text-[11px] truncate">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div>
                <span className="text-slate-400 font-bold block mb-1.5">Model Gaya Rambut:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'spiky', label: '🔥 Runcing Keren' },
                    { id: 'short', label: '✂️ Pendek Rapi' },
                    { id: 'long', label: '🌊 Panjang Mengalir' },
                    { id: 'ponytail', label: '🎀 Kuncir Petualang' },
                  ].map((h) => (
                    <button
                      key={h.id}
                      onClick={() => { sound.playClick(); setAppearance((prev) => ({ ...prev, hairStyle: h.id as any })); }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition ${
                        appearance.hairStyle === h.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-700 bg-slate-800 text-slate-300'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <span className="text-slate-400 font-bold block mb-1.5">Warna Rambut:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'brown', label: 'Cokelat', color: '#78350f' },
                    { id: 'black', label: 'Hitam', color: '#0f172a' },
                    { id: 'blonde', label: 'Pirang', color: '#facc15' },
                    { id: 'crimson', label: 'Merah Api', color: '#dc2626' },
                    { id: 'cyan', label: 'Biru Es', color: '#0284c7' },
                    { id: 'purple', label: 'Ungu Mistis', color: '#7e22ce' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { sound.playClick(); setAppearance((prev) => ({ ...prev, hairColor: c.id as any })); }}
                      className={`p-2 rounded-xl border flex items-center gap-2 ${
                        appearance.hairColor === c.id ? 'border-amber-400 bg-amber-500/20 font-bold' : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-white/40" style={{ backgroundColor: c.color }}></span>
                      <span className="text-[11px] truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OUTFIT & HEADGEAR */}
          {activeTab === 'outfit' && (
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
              {/* Outfit Color Palette */}
              <div>
                <span className="text-slate-400 font-bold block mb-1.5">Warna Zirah &amp; Jubah:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'red', label: 'Merah Bara Api', color: '#dc2626' },
                    { id: 'blue', label: 'Biru Samudra', color: '#2563eb' },
                    { id: 'emerald', label: 'Hijau Zamrud', color: '#059669' },
                    { id: 'gold', label: 'Emas Ksatria', color: '#ca8a04' },
                    { id: 'purple', label: 'Ungu Amethyst', color: '#7c3aed' },
                    { id: 'dark', label: 'Hitam Bayangan', color: '#1e293b' },
                  ].map((o) => (
                    <button
                      key={o.id}
                      onClick={() => { sound.playClick(); setAppearance((prev) => ({ ...prev, outfitColor: o.id as any })); }}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                        appearance.outfitColor === o.id ? 'border-amber-400 bg-amber-500/20 font-bold text-amber-300' : 'border-slate-700 bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-lg border border-white/30" style={{ backgroundColor: o.color }}></span>
                      <span>{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Headgear */}
              <div>
                <span className="text-slate-400 font-bold block mb-1.5">Aksesori Kepala:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'headband', label: '🎗️ Ikat Kepala Petarung' },
                    { id: 'wizard_hat', label: '🧙 Topi Penyihir Kuno' },
                    { id: 'crown', label: '👑 Mahkota Angka Emas' },
                    { id: 'knight_helm', label: '⚔️ Helm Baja Ksatria' },
                    { id: 'none', label: '❌ Tanpa Topi (Pamer Rambut)' },
                  ].map((hg) => (
                    <button
                      key={hg.id}
                      onClick={() => { sound.playClick(); setAppearance((prev) => ({ ...prev, headgear: hg.id as any })); }}
                      className={`p-2 rounded-xl border text-left font-bold transition ${
                        appearance.headgear === hg.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-700 bg-slate-800 text-slate-300'
                      }`}
                    >
                      {hg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WEAPON & AURA */}
          {activeTab === 'gear' && (
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
              {/* Weapon Choice */}
              <div>
                <span className="text-slate-400 font-bold block mb-1.5">Senjata Pilihan:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sword', label: '🗡️ Pedang Berapi', desc: 'Tebasan matematis membara' },
                    { id: 'staff', label: '🔮 Tongkat Kristal', desc: 'Bola sihir orbit bilangan bulat' },
                    { id: 'bow', label: '🏹 Busur Panah Petir', desc: 'Panah bertegangan tinggi' },
                    { id: 'spear', label: '🔱 Tombak Emas Halilintar', desc: 'Tusukan tajam penuh presisi' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      onClick={() => { sound.playClick(); setAppearance((prev) => ({ ...prev, weaponType: w.id as any })); }}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        appearance.weaponType === w.id ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold' : 'border-slate-700 bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-sm text-white">{w.label}</div>
                      <div className="text-[10px] text-slate-400">{w.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aura Effect */}
              <div>
                <span className="text-slate-400 font-bold block mb-1.5">Aura Kekuatan:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'flame', label: '🔥 Api Bara' },
                    { id: 'lightning', label: '⚡ Petir Kilat' },
                    { id: 'frost', label: '❄️ Kristal Es' },
                    { id: 'cosmic', label: '🌌 Bintang Kosmik' },
                    { id: 'none', label: '✨ Tenang' },
                  ].map((au) => (
                    <button
                      key={au.id}
                      onClick={() => { sound.playClick(); setAppearance((prev) => ({ ...prev, aura: au.id as any })); }}
                      className={`p-2 rounded-xl border text-center font-bold transition ${
                        appearance.aura === au.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-700 bg-slate-800 text-slate-300'
                      }`}
                    >
                      {au.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Modifikasi</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
