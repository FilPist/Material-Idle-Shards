import React from 'react';
import { useGame } from './hooks/useGame';
import { StatsBar } from './components/StatsBar';
import { MainDisplay } from './components/MainDisplay';
import { ControlPanel } from './components/ControlPanel';
import { PrestigeModal, OfflineProgressModal, ChallengeConfirmationModal, AscensionModal, EvolutionModal } from './components/modals';
import { Settings } from './components/Settings';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { Achievement } from './types';
import { AchievementIcon } from './components/icons';
import { ActiveSkillsBar } from './components/ActiveSkillsBar';

const AchievementToast: React.FC<{ achievement: Achievement; t: (key: string) => string; onEnd: () => void }> = ({ achievement, t, onEnd }) => {
    return (
        <div onAnimationEnd={onEnd} className="fixed top-6 right-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-4 flex items-center gap-4 z-50 achievement-toast max-w-[calc(100vw-3rem)]">
            <AchievementIcon className="w-10 h-10 text-amber-500 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t('achievements_panel.toast_title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 font-semibold">{t(achievement.nameKey)}</p>
                <p className="text-teal-600 dark:text-teal-400 text-sm font-bold mt-1">{t('achievements_panel.bonus_prefix')} {t(achievement.bonus.descriptionKey)}</p>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const game = useGame();
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const evolutionModalGenerator = game.generatorToEvolve || game.evolutionPreviewGenerator;

  return (
    <div className={`h-[100dvh] w-screen flex flex-col p-1 sm:p-2 md:p-4 overflow-hidden dark:text-slate-200 text-slate-800`}>
      {game.achievementToast && <AchievementToast achievement={game.achievementToast} t={t} onEnd={() => game.setAchievementToast(null)} />}
      {game.showPrestigeModal && <PrestigeModal game={game} t={t} />}
      {game.showAscensionModal && <AscensionModal game={game} t={t} />}
      {(game.showEvolutionModal && evolutionModalGenerator) && <EvolutionModal 
          generator={evolutionModalGenerator}
          onEvolve={game.handleEvolveGenerator}
          onClose={game.closeEvolutionModal}
          t={t}
          isPreview={!!game.evolutionPreviewGenerator}
      />}
      {game.offlineProgress && <OfflineProgressModal game={game} t={t} />}
      {game.challengeToStart && <ChallengeConfirmationModal 
          challenge={game.challengeToStart}
          onConfirm={game.confirmStartChallenge}
          onCancel={game.cancelStartChallenge}
          t={t}
      />}

      {/* Header */}
      <header className="flex-shrink-0 w-full max-w-[1400px] mx-auto">
        <StatsBar game={game} t={t} />
      </header>
      
      {/* Main content area */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 mt-4 min-h-0">
          
          {/* Main Display Area (Clicker) */}
          <div className="md:basis-3/5 h-full min-h-0 relative pb-[140px] md:pb-0">
               <MainDisplay game={game} t={t} />
               <ActiveSkillsBar game={game} t={t} />
          </div>
          
          {/* Sidebar / Mobile Panel Area */}
          <div className="md:basis-2/5 h-full min-h-0 md:relative">
               <ControlPanel game={game} t={t} />
          </div>
      </main>

      <Settings game={game} t={t} />
    </div>
  );
};

export default App;