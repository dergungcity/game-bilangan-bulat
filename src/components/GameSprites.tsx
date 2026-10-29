import React from 'react';
import { HeroClass, HeroAppearance } from '../types/game';

interface HeroSpriteProps {
  heroClass?: HeroClass;
  appearance?: HeroAppearance;
  actionState: 'idle' | 'attack' | 'hit' | 'victory';
  className?: string;
}

// Color palettes for customization
const SKIN_COLORS: Record<string, string> = {
  light: '#fcd34d',
  tan: '#f59e0b',
  warm: '#d97706',
};

const HAIR_COLORS: Record<string, string> = {
  brown: '#78350f',
  black: '#0f172a',
  blonde: '#facc15',
  crimson: '#b91c1c',
  cyan: '#0284c7',
  purple: '#7e22ce',
};

const OUTFIT_THEMES: Record<string, { primary: string; secondary: string; highlight: string; cape: string }> = {
  red: { primary: '#b45309', secondary: '#991b1b', highlight: '#f59e0b', cape: '#dc2626' },
  blue: { primary: '#1e40af', secondary: '#1e3a8a', highlight: '#60a5fa', cape: '#2563eb' },
  emerald: { primary: '#065f46', secondary: '#064e3b', highlight: '#34d399', cape: '#059669' },
  gold: { primary: '#ca8a04', secondary: '#854d0e', highlight: '#fde047', cape: '#d97706' },
  purple: { primary: '#6b21a8', secondary: '#581c87', highlight: '#c084fc', cape: '#7c3aed' },
  dark: { primary: '#1e293b', secondary: '#0f172a', highlight: '#64748b', cape: '#334155' },
};

export const HeroSprite: React.FC<HeroSpriteProps> = ({
  heroClass = 'warrior',
  appearance,
  actionState,
  className = '',
}) => {
  const isAttack = actionState === 'attack';
  const isHit = actionState === 'hit';
  const isVictory = actionState === 'victory';

  // Fallbacks if appearance not supplied
  const skin = SKIN_COLORS[appearance?.skinTone || 'light'] || '#fcd34d';
  const hairColor = HAIR_COLORS[appearance?.hairColor || (heroClass === 'mage' ? 'black' : 'brown')] || '#78350f';
  const outfit = OUTFIT_THEMES[appearance?.outfitColor || (heroClass === 'mage' ? 'purple' : 'red')] || OUTFIT_THEMES.red;
  const hairStyle = appearance?.hairStyle || (heroClass === 'mage' ? 'long' : 'spiky');
  const headgear = appearance?.headgear || (heroClass === 'mage' ? 'wizard_hat' : 'headband');
  const weapon = appearance?.weaponType || (heroClass === 'mage' ? 'staff' : 'sword');
  const aura = appearance?.aura || 'flame';

  // Aura styling
  const getAuraColor = () => {
    switch (aura) {
      case 'flame': return 'bg-amber-500/25 blur-xl';
      case 'lightning': return 'bg-yellow-400/30 blur-xl';
      case 'frost': return 'bg-cyan-400/25 blur-xl';
      case 'cosmic': return 'bg-fuchsia-500/25 blur-xl';
      default: return 'bg-amber-500/10 blur-lg';
    }
  };

  return (
    <div className={`relative transition-transform duration-200 ${isAttack ? 'translate-x-12 scale-110' : ''} ${isHit ? '-translate-x-4 animate-shake brightness-150' : ''} ${className}`}>
      {/* Dynamic Magical Aura */}
      <div className={`absolute inset-0 rounded-full scale-125 ${getAuraColor()}`}></div>

      <svg viewBox="0 0 200 240" className="w-36 h-44 md:w-48 md:h-56 filter drop-shadow-lg">
        {/* Shadow */}
        <ellipse cx="95" cy="225" rx="50" ry="12" fill="rgba(0,0,0,0.3)" />

        {/* Dynamic Cape */}
        <path
          d="M60 90 Q25 150 35 210 Q80 200 95 180 Z"
          fill={outfit.cape}
          className="animate-pulse"
        />

        {/* Legs / Boots */}
        <rect x="75" y="160" width="16" height="50" rx="8" fill="#1e293b" />
        <rect x="105" y="160" width="16" height="50" rx="8" fill="#1e293b" />
        <rect x="70" y="200" width="22" height="15" rx="4" fill={outfit.secondary} />
        <rect x="105" y="200" width="22" height="15" rx="4" fill={outfit.secondary} />

        {/* Body Armor / Robe */}
        <path
          d="M70 100 L125 100 L118 165 L77 165 Z"
          fill={outfit.primary}
          stroke={outfit.highlight}
          strokeWidth="3"
        />

        {/* Chestplate Math Sigil */}
        <circle cx="97" cy="125" r="14" fill="#fef08a" stroke={outfit.secondary} strokeWidth="2" />
        {heroClass === 'mage' ? (
          <text x="97" y="131" textAnchor="middle" fill="#1e1b4b" fontSize="16" fontWeight="bold">∞</text>
        ) : heroClass === 'archer' ? (
          <text x="97" y="131" textAnchor="middle" fill="#1e1b4b" fontSize="14" fontWeight="bold">➹</text>
        ) : heroClass === 'paladin' ? (
          <text x="97" y="131" textAnchor="middle" fill="#1e1b4b" fontSize="16" fontWeight="bold">✛</text>
        ) : (
          <path d="M97 115 L97 135 M87 125 L107 125" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* Head & Skin */}
        <circle cx="97" cy="65" r="28" fill={skin} />

        {/* Dynamic Hair Styles */}
        {hairStyle === 'spiky' && (
          <path
            d="M68 55 Q97 20 126 55 Q135 45 125 35 Q97 15 70 35 Z"
            fill={hairColor}
          />
        )}
        {hairStyle === 'short' && (
          <path
            d="M70 60 Q97 32 124 60 Q130 50 120 40 Q97 28 72 40 Z"
            fill={hairColor}
          />
        )}
        {hairStyle === 'long' && (
          <path
            d="M68 65 Q97 30 126 65 Q138 120 120 125 Q97 90 74 125 Z"
            fill={hairColor}
          />
        )}
        {hairStyle === 'ponytail' && (
          <g>
            <path d="M70 55 Q97 30 124 55 Q125 40 100 35 Z" fill={hairColor} />
            <path d="M68 55 Q40 50 45 90 Q55 85 65 65 Z" fill={hairColor} />
          </g>
        )}

        {/* Headgear Customization */}
        {headgear === 'headband' && (
          <g>
            <rect x="68" y="52" width="58" height="10" rx="3" fill="#dc2626" />
            <circle cx="97" cy="57" r="4" fill="#fbbf24" />
          </g>
        )}
        {headgear === 'wizard_hat' && (
          <g>
            <path d="M50 58 Q97 50 144 58 Z" stroke="#312e81" strokeWidth="6" fill="#312e81" strokeLinecap="round" />
            <path d="M68 56 L97 5 L126 56 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="2" />
            <rect x="76" y="48" width="42" height="6" fill="#a855f7" rx="1" />
            <circle cx="97" cy="51" r="4" fill="#facc15" />
          </g>
        )}
        {headgear === 'crown' && (
          <g>
            <polygon points="75,45 82,20 90,38 97,15 104,38 112,20 119,45" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="97" cy="30" r="3" fill="#ec4899" />
          </g>
        )}
        {headgear === 'knight_helm' && (
          <g>
            <path d="M72 45 Q97 25 122 45 L125 65 L69 65 Z" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="78" y="52" width="38" height="6" rx="2" fill="#0f172a" />
          </g>
        )}

        {/* Eyes & Expression */}
        <circle cx="88" cy="66" r="3.5" fill="#0f172a" />
        <circle cx="106" cy="66" r="3.5" fill="#0f172a" />
        <circle cx="89" cy="65" r="1" fill="#ffffff" />
        <circle cx="107" cy="65" r="1" fill="#ffffff" />
        {/* Mouth */}
        <path
          d={isHit ? "M90 78 Q97 73 104 78" : "M90 75 Q97 82 104 75"}
          stroke="#78350f"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Left Arm & Shield / Focus */}
        <g transform={isAttack ? "rotate(-10 65 110)" : "rotate(0 65 110)"}>
          <rect x="52" y="105" width="14" height="40" rx="6" fill={outfit.primary} />
          {/* Round Shield with Math Emblem */}
          <circle cx="50" cy="135" r="26" fill={outfit.secondary} stroke={outfit.highlight} strokeWidth="3" />
          <circle cx="50" cy="135" r="16" fill={outfit.primary} />
          <text x="50" y="141" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
            {heroClass === 'mage' ? '❄' : heroClass === 'archer' ? '⚡' : '+'}
          </text>
        </g>

        {/* Right Arm & Selected Weapon */}
        <g transform={isAttack ? "rotate(45 130 110) translate(20, -10)" : isVictory ? "rotate(-60 130 110)" : "rotate(0 130 110)"}>
          <rect x="125" y="105" width="14" height="35" rx="6" fill={outfit.primary} />

          {/* SWORD */}
          {weapon === 'sword' && (
            <g>
              <rect x="135" y="125" width="22" height="6" rx="2" fill="#d97706" />
              <rect x="143" y="131" width="6" height="14" rx="2" fill="#78350f" />
              <path d="M146 125 L144 30 Q146 15 149 30 L146 125 Z" fill="#f8fafc" stroke="#f59e0b" strokeWidth="3" />
              <path d="M141 120 Q135 60 146 20 Q157 60 151 120 Z" fill="rgba(249, 115, 22, 0.4)" className="animate-pulse" />
            </g>
          )}

          {/* STAFF */}
          {weapon === 'staff' && (
            <g>
              <rect x="135" y="25" width="8" height="170" rx="4" fill="#78350f" />
              <circle cx="139" cy="20" r="18" fill="#38bdf8" className="animate-pulse" />
              <circle cx="139" cy="20" r="10" fill="#ffffff" />
              <circle cx="120" cy="15" r="6" fill="#818cf8" />
              <text x="120" y="18" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">-</text>
            </g>
          )}

          {/* BOW */}
          {weapon === 'bow' && (
            <g>
              <path d="M145 20 Q170 80 145 150" stroke="#ca8a04" strokeWidth="5" fill="none" strokeLinecap="round" />
              <line x1="145" y1="20" x2="145" y2="150" stroke="#f8fafc" strokeWidth="1.5" />
              {/* Elemental Arrow */}
              <line x1="130" y1="85" x2="165" y2="85" stroke="#38bdf8" strokeWidth="3" />
              <polygon points="165,85 158,80 158,90" fill="#38bdf8" />
            </g>
          )}

          {/* SPEAR */}
          {weapon === 'spear' && (
            <g>
              <rect x="137" y="10" width="6" height="180" rx="3" fill="#94a3b8" />
              <polygon points="140,5 130,35 150,35" fill="#facc15" stroke="#eab308" strokeWidth="2" />
              <circle cx="140" cy="40" r="4" fill="#38bdf8" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

interface MonsterSpriteProps {
  levelNumber: number;
  actionState: 'idle' | 'attack' | 'hit';
  className?: string;
}

export const MonsterSprite: React.FC<MonsterSpriteProps> = ({ levelNumber, actionState, className = '' }) => {
  const isAttack = actionState === 'attack';
  const isHit = actionState === 'hit';

  return (
    <div className={`relative transition-transform duration-200 ${isAttack ? '-translate-x-12 scale-110' : ''} ${isHit ? 'translate-x-4 animate-shake brightness-150 filter' : ''} ${className}`}>
      {levelNumber === 1 && (
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-110"></div>
          <svg viewBox="0 0 200 200" className="w-36 h-36 md:w-48 md:h-48">
            <ellipse cx="100" cy="180" rx="60" ry="12" fill="rgba(0,0,0,0.3)" />
            <path
              d="M40 160 C30 110, 60 40, 100 40 C140 40, 170 110, 160 160 C155 180, 45 180, 40 160 Z"
              fill="#10b981"
              stroke="#047857"
              strokeWidth="4"
              className="animate-pulse"
            />
            <path d="M65 65 Q95 50 115 60 Q95 70 65 65 Z" fill="#6ee7b7" opacity="0.8" />
            <rect x="65" y="85" width="70" height="20" rx="6" fill="#064e3b" />
            <rect x="75" y="92" width="50" height="6" rx="3" fill="#ffffff" />
            <circle cx="80" cy="120" r="8" fill="#ffffff" />
            <circle cx="82" cy="120" r="5" fill="#0f172a" />
            <circle cx="120" cy="120" r="8" fill="#ffffff" />
            <circle cx="118" cy="120" r="5" fill="#0f172a" />
            <path d="M92 145 Q100 138 108 145" stroke="#064e3b" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="140" cy="80" r="8" fill="#34d399" opacity="0.6" />
            <circle cx="150" cy="65" r="5" fill="#6ee7b7" opacity="0.7" />
          </svg>
        </div>
      )}

      {levelNumber === 2 && (
        <div className="relative">
          <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full scale-110"></div>
          <svg viewBox="0 0 200 220" className="w-36 h-40 md:w-48 md:h-52">
            <ellipse cx="100" cy="205" rx="65" ry="12" fill="rgba(0,0,0,0.3)" />
            <polygon points="50,110 30,60 70,80" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="150,110 170,60 130,80" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="100,60 100,20 120,50" fill="#0ea5e9" stroke="#7dd3fc" strokeWidth="2" />
            <polygon points="55,100 145,100 160,180 40,180" fill="#0369a1" stroke="#38bdf8" strokeWidth="4" />
            <line x1="75" y1="130" x2="125" y2="130" stroke="#7dd3fc" strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="115" x2="100" y2="145" stroke="#7dd3fc" strokeWidth="6" strokeLinecap="round" />
            <polygon points="70,60 130,60 140,100 60,100" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="3" />
            <rect x="75" y="75" width="16" height="8" rx="2" fill="#38bdf8" className="animate-pulse" />
            <rect x="109" y="75" width="16" height="8" rx="2" fill="#38bdf8" className="animate-pulse" />
            <rect x="25" y="140" width="30" height="40" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <rect x="145" y="140" width="30" height="40" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          </svg>
        </div>
      )}

      {levelNumber === 3 && (
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-110"></div>
          <svg viewBox="0 0 220 200" className="w-40 h-36 md:w-52 md:h-48">
            <ellipse cx="110" cy="185" rx="70" ry="12" fill="rgba(0,0,0,0.3)" />
            <path d="M40 140 Q70 90 150 100 Q190 120 180 170 Q110 180 40 140 Z" fill="#3b0764" stroke="#a855f7" strokeWidth="3" />
            <path d="M120 110 L190 80 L160 130 Z" fill="#581c87" stroke="#c084fc" strokeWidth="2" />
            <polygon points="130,80 135,30 155,75" fill="#3b0764" stroke="#a855f7" strokeWidth="2" />
            <polygon points="150,85 165,35 175,80" fill="#3b0764" stroke="#a855f7" strokeWidth="2" />
            <circle cx="160" cy="95" r="5" fill="#f43f5e" />
            <circle cx="161" cy="94" r="2" fill="#ffffff" />
            <polygon points="175,125 182,140 185,125" fill="#ffffff" />
            <polygon points="165,125 170,138 175,125" fill="#ffffff" />
            <path d="M40 140 Q10 110 20 80 Q45 100 50 130 Z" fill="#7e22ce" opacity="0.8" className="animate-pulse" />
          </svg>
        </div>
      )}

      {levelNumber === 4 && (
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full scale-125"></div>
          <svg viewBox="0 0 240 220" className="w-44 h-40 md:w-56 md:h-52">
            <ellipse cx="120" cy="205" rx="75" ry="12" fill="rgba(0,0,0,0.3)" />
            <path d="M100 100 Q30 30 10 70 Q50 110 80 140 Z" fill="#991b1b" stroke="#f97316" strokeWidth="2" />
            <path d="M140 100 Q210 30 230 70 Q190 110 160 140 Z" fill="#991b1b" stroke="#f97316" strokeWidth="2" />
            <path d="M80 110 Q120 80 160 110 Q170 180 120 195 Q70 180 80 110 Z" fill="#c2410c" stroke="#fbbf24" strokeWidth="3" />
            <path d="M100 130 Q120 120 140 130 Q130 170 120 175 Q110 170 100 130 Z" fill="#f59e0b" className="animate-pulse" />
            <polygon points="90,90 120,40 150,90 120,110" fill="#7f1d1d" stroke="#f97316" strokeWidth="2" />
            <path d="M95 55 Q75 15 85 5" stroke="#ea580c" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M145 55 Q165 15 155 5" stroke="#ea580c" strokeWidth="4" fill="none" strokeLinecap="round" />
            <polygon points="105,70 115,70 110,78" fill="#fef08a" />
            <polygon points="125,70 135,70 130,78" fill="#fef08a" />
            <circle cx="120" cy="115" r="8" fill="#fb923c" opacity="0.7" className="animate-ping" />
          </svg>
        </div>
      )}

      {levelNumber === 5 && (
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500/25 blur-xl rounded-full scale-120"></div>
          <svg viewBox="0 0 220 230" className="w-40 h-44 md:w-52 md:h-56">
            <ellipse cx="110" cy="215" rx="60" ry="12" fill="rgba(0,0,0,0.3)" />
            <path d="M75 90 L145 90 L155 180 L65 180 Z" fill="#713f12" stroke="#eab308" strokeWidth="3" />
            <path d="M85 45 Q110 20 135 45 L140 90 L80 90 Z" fill="#854d0e" stroke="#facc15" strokeWidth="3" />
            <rect x="90" y="60" width="40" height="8" rx="2" fill="#0f172a" />
            <line x1="95" y1="64" x2="125" y2="64" stroke="#ef4444" strokeWidth="3" className="animate-pulse" />
            <path d="M110 25 Q130 5 150 15" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" fill="none" />
            <rect x="40" y="85" width="45" height="95" rx="8" fill="#ca8a04" stroke="#fef08a" strokeWidth="3" />
            <text x="62" y="115" textAnchor="middle" fill="#451a03" fontSize="16" fontWeight="bold">×</text>
            <text x="62" y="140" textAnchor="middle" fill="#451a03" fontSize="16" fontWeight="bold">÷</text>
            <text x="62" y="165" textAnchor="middle" fill="#451a03" fontSize="16" fontWeight="bold">+</text>
            <rect x="155" y="60" width="10" height="130" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <rect x="145" y="150" width="30" height="8" rx="2" fill="#a16207" />
          </svg>
        </div>
      )}

      {levelNumber === 6 && (
        <div className="relative">
          <div className="absolute inset-0 bg-pink-500/30 blur-2xl rounded-full scale-130 animate-pulse"></div>
          <svg viewBox="0 0 240 240" className="w-44 h-44 md:w-60 md:h-60">
            <ellipse cx="120" cy="225" rx="75" ry="12" fill="rgba(0,0,0,0.4)" />
            <ellipse cx="120" cy="120" rx="100" ry="35" fill="none" stroke="#f472b6" strokeWidth="5" strokeDasharray="15 10" transform="rotate(-20 120 120)" className="animate-spin" />
            <path d="M70 100 L170 100 L185 210 L55 210 Z" fill="#500724" stroke="#ec4899" strokeWidth="4" />
            <circle cx="120" cy="150" r="24" fill="#0f172a" stroke="#db2777" strokeWidth="3" />
            <text x="120" y="160" textAnchor="middle" fill="#f472b6" fontSize="28" fontWeight="black" fontFamily="monospace">0</text>
            <circle cx="120" cy="70" r="30" fill="#831843" stroke="#f472b6" strokeWidth="2" />
            <polygon points="85,55 95,15 110,40 120,5 130,40 145,15 155,55" fill="#f59e0b" stroke="#fde047" strokeWidth="2" />
            <circle cx="120" cy="25" r="4" fill="#ec4899" />
            <circle cx="110" cy="72" r="4" fill="#67e8f9" className="animate-ping" />
            <circle cx="130" cy="72" r="4" fill="#67e8f9" className="animate-ping" />
            <path d="M50 180 Q30 140 45 100" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M190 180 Q210 140 195 100" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
          </svg>
        </div>
      )}
    </div>
  );
};
