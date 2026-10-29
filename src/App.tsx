import React, { useState } from 'react';
import { GameScreen, HeroStats, LevelInfo } from './types/game';
import { getSavedHero, resetHero, saveHero } from './utils/storage';
import { GAME_LEVELS } from './data/monsters';
import { TitleScreen } from './components/TitleScreen';
import { MapScreen } from './components/MapScreen';
import { BattleScreen } from './components/BattleScreen';
import { UpgradeShop } from './components/UpgradeShop';
import { BukuPanduanModal } from './components/BukuPanduanModal';
import { VictoryModal } from './components/VictoryModal';
import { DefeatModal } from './components/DefeatModal';
import { CertificateModal } from './components/CertificateModal';
import { CharacterCustomizerModal } from './components/CharacterCustomizerModal';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('title');
  const [hero, setHero] = useState<HeroStats>(() => getSavedHero());
  const [selectedLevel, setSelectedLevel] = useState<LevelInfo | null>(null);
  const [isEndlessMode, setIsEndlessMode] = useState<boolean>(false);

  // Modals
  const [isHandbookOpen, setIsHandbookOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [victoryData, setVictoryData] = useState<{
    levelNumber: number;
    levelTitle: string;
    monsterName: string;
    stars: number;
    earnedGold: number;
    earnedExp: number;
    damageDealt: number;
  } | null>(null);
  const [isDefeatOpen, setIsDefeatOpen] = useState<boolean>(false);

  // Update Hero and persist
  const handleUpdateHero = (updated: HeroStats) => {
    setHero(updated);
    saveHero(updated);
  };

  // Reset progress
  const handleResetProgress = () => {
    const refreshed = resetHero();
    setHero(refreshed);
    setScreen('title');
  };

  // Start Level
  const handleSelectLevel = (level: LevelInfo) => {
    setSelectedLevel(level);
    setIsEndlessMode(false);
    setVictoryData(null);
    setIsDefeatOpen(false);
    setScreen('battle');
  };

  // Start Endless Mode
  const handleStartEndless = () => {
    setSelectedLevel(GAME_LEVELS[5]);
    setIsEndlessMode(true);
    setVictoryData(null);
    setIsDefeatOpen(false);
    setScreen('battle');
  };

  // Handle Battle Victory
  const handleVictory = (stars: number, earnedGold: number, earnedExp: number, damageDealt: number) => {
    if (!selectedLevel) return;

    const levelNum = selectedLevel.levelNumber;
    const currentStars = hero.levelStars[levelNum] || 0;
    const newStars = Math.max(currentStars, stars);

    const nextUnlocked = Math.max(
      hero.unlockedLevel,
      levelNum < 6 ? levelNum + 1 : 6
    );

    const updatedHero: HeroStats = {
      ...hero,
      gold: hero.gold + earnedGold,
      exp: hero.exp + earnedExp,
      unlockedLevel: nextUnlocked,
      levelStars: {
        ...hero.levelStars,
        [levelNum]: newStars,
      },
      totalBattlesWon: hero.totalBattlesWon + 1,
      totalCorrect: hero.totalCorrect + selectedLevel.targetQuestions,
    };

    handleUpdateHero(updatedHero);

    setVictoryData({
      levelNumber: levelNum,
      levelTitle: selectedLevel.title,
      monsterName: selectedLevel.monster.name,
      stars,
      earnedGold,
      earnedExp,
      damageDealt,
    });
  };

  // Handle Battle Defeat
  const handleDefeat = () => {
    setIsDefeatOpen(true);
  };

  // Proceed to Next Level after victory
  const handleNextLevel = () => {
    if (!selectedLevel) return;
    const nextIdx = selectedLevel.levelNumber; // 1-based index to next level
    if (nextIdx < GAME_LEVELS.length) {
      setSelectedLevel(GAME_LEVELS[nextIdx]);
      setVictoryData(null);
      setScreen('battle');
    } else {
      setVictoryData(null);
      setScreen('map');
    }
  };

  // Retry current level
  const handleRetry = () => {
    setVictoryData(null);
    setIsDefeatOpen(false);
    setScreen('battle');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-game selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. TITLE SCREEN */}
      {screen === 'title' && (
        <TitleScreen
          hero={hero}
          onStartGame={() => setScreen('map')}
          onOpenHandbook={() => setIsHandbookOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onUpdateHero={handleUpdateHero}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* 2. MAP / LEVEL SELECTION SCREEN */}
      {screen === 'map' && (
        <MapScreen
          hero={hero}
          onSelectLevel={handleSelectLevel}
          onOpenUpgrade={() => setScreen('upgrade')}
          onOpenHandbook={() => setIsHandbookOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onStartEndless={handleStartEndless}
        />
      )}

      {/* 3. BATTLE SCREEN */}
      {screen === 'battle' && selectedLevel && (
        <BattleScreen
          levelInfo={selectedLevel}
          hero={hero}
          isEndless={isEndlessMode}
          onVictory={handleVictory}
          onDefeat={handleDefeat}
          onExit={() => setScreen('map')}
          onUpdateHero={handleUpdateHero}
        />
      )}

      {/* 4. UPGRADE & PROGRESSION SHOP SCREEN */}
      {screen === 'upgrade' && (
        <UpgradeShop
          hero={hero}
          onUpdateHero={handleUpdateHero}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onBack={() => setScreen('map')}
        />
      )}

      {/* MODALS */}
      {/* Character Customization Modal */}
      <CharacterCustomizerModal
        isOpen={isCustomizerOpen}
        hero={hero}
        onSave={handleUpdateHero}
        onClose={() => setIsCustomizerOpen(false)}
      />

      {/* Handbook & Cheat Sheet Modal */}
      <BukuPanduanModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      {/* Certificate Modal */}
      <CertificateModal
        hero={hero}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Victory Celebration Modal */}
      {victoryData && (
        <VictoryModal
          levelNumber={victoryData.levelNumber}
          levelTitle={victoryData.levelTitle}
          monsterName={victoryData.monsterName}
          stars={victoryData.stars}
          earnedGold={victoryData.earnedGold}
          earnedExp={victoryData.earnedExp}
          damageDealt={victoryData.damageDealt}
          onNextLevel={handleNextLevel}
          onOpenUpgrade={() => {
            setVictoryData(null);
            setScreen('upgrade');
          }}
          onRetry={handleRetry}
          onBackToMap={() => {
            setVictoryData(null);
            setScreen('map');
          }}
        />
      )}

      {/* Defeat Encouragement Modal */}
      {isDefeatOpen && selectedLevel && (
        <DefeatModal
          levelTitle={selectedLevel.title}
          monsterName={selectedLevel.monster.name}
          onRetry={handleRetry}
          onOpenUpgrade={() => {
            setIsDefeatOpen(false);
            setScreen('upgrade');
          }}
          onOpenHandbook={() => setIsHandbookOpen(true)}
          onBackToMap={() => {
            setIsDefeatOpen(false);
            setScreen('map');
          }}
        />
      )}

    </div>
  );
}
