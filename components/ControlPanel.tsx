import React from 'react';
import { PanelTab } from '../types';
import { useGameHook } from '../hooks/useGame';
import { AutomationIcon, AchievementIcon, UpgradeIcon, BoltIcon, PrestigeIcon, TalismanIcon, BookIcon, ChartBarIcon } from './icons';
import { GeneratorsPanel } from './panels/GeneratorsPanel';
import { UpgradesPanel } from './panels/UpgradesPanel';
import { SkillsPanel } from './panels/SkillsPanel';
import { TalismansPanel } from './panels/TalismansPanel';
import { AchievementsPanel } from './panels/AchievementsPanel';
import { PrestigePanel } from './panels/PrestigePanel';
import { LorePanel } from './panels/LorePanel';
import { StatsPanel } from './panels/StatsPanel';
import { BuyAmountSelector } from './shared/BuyAmountSelector';

interface ControlPanelProps {
  game: useGameHook;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const TabButton: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-2 rounded-full transition-all duration-300 ease-in-out group relative justify-center shadow-lg backdrop-blur-md
      ${isActive 
        ? 'bg-violet-600' 
        : 'bg-white/50 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-800/70'
      }`}
    aria-label={label}
  >
    <div className={`transition-colors ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className={`font-bold whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden text-sm ${isActive ? 'max-w-[100px] opacity-100 pr-1' : 'max-w-0 opacity-0'} ${isActive ? 'text-white' : ''}`}>
      {label}
    </span>
  </button>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({ game, t }) => {
    const { activeTab, setActiveTab, buyAmount, setBuyAmount } = game;
    
    const panelContent = () => {
        switch (activeTab) {
            case PanelTab.Generators: return <GeneratorsPanel game={game} t={t} />;
            case PanelTab.Upgrades: return <UpgradesPanel game={game} t={t} />;
            case PanelTab.Skills: return <SkillsPanel game={game} t={t} />;
            case PanelTab.Talismans: return <TalismansPanel game={game} t={t} />;
            case PanelTab.Achievements: return <AchievementsPanel game={game} t={t} />;
            case PanelTab.Prestige: return <PrestigePanel game={game} t={t} />;
            case PanelTab.Lore: return <LorePanel game={game} t={t} />;
            case PanelTab.Stats: return <StatsPanel game={game} t={t} />;
            default: return null;
        }
    };
    
    return (
        <div className="fixed bottom-2 left-2 right-2 md:absolute md:inset-x-0 md:top-0 md:bottom-6 flex flex-col-reverse md:flex-col items-center md:items-stretch gap-2 z-20">
            {/* Tabs */}
            <div className="flex-shrink-0 flex flex-row justify-center flex-wrap gap-1">
                <TabButton icon={AutomationIcon} label={t('tabs.generators')} isActive={activeTab === PanelTab.Generators} onClick={() => setActiveTab(PanelTab.Generators)} />
                <TabButton icon={UpgradeIcon} label={t('tabs.upgrades')} isActive={activeTab === PanelTab.Upgrades} onClick={() => setActiveTab(PanelTab.Upgrades)} />
                <TabButton icon={BoltIcon} label={t('tabs.skills')} isActive={activeTab === PanelTab.Skills} onClick={() => setActiveTab(PanelTab.Skills)} />
                <TabButton icon={TalismanIcon} label={t('tabs.talismans')} isActive={activeTab === PanelTab.Talismans} onClick={() => setActiveTab(PanelTab.Talismans)} />
                <TabButton icon={AchievementIcon} label={t('tabs.achievements')} isActive={activeTab === PanelTab.Achievements} onClick={() => setActiveTab(PanelTab.Achievements)} />
                <TabButton icon={PrestigeIcon} label={t('tabs.prestige')} isActive={activeTab === PanelTab.Prestige} onClick={() => setActiveTab(PanelTab.Prestige)} />
                <TabButton icon={BookIcon} label={t('tabs.lore')} isActive={activeTab === PanelTab.Lore} onClick={() => setActiveTab(PanelTab.Lore)} />
                <TabButton icon={ChartBarIcon} label={t('tabs.stats')} isActive={activeTab === PanelTab.Stats} onClick={() => setActiveTab(PanelTab.Stats)} />
            </div>

            {/* Content Panel */}
            <div 
                className="bg-slate-100/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-lg flex flex-col w-full h-auto max-h-[45vh] md:flex-grow md:max-h-full"
            >
              {(activeTab === PanelTab.Generators || activeTab === PanelTab.Upgrades || activeTab === PanelTab.Skills) && (
                <div className="border-b border-slate-200 dark:border-slate-700/50 p-2">
                    <BuyAmountSelector amount={buyAmount} setAmount={setBuyAmount} t={t} />
                </div>
              )}
                <div className="flex-grow p-2 overflow-y-auto custom-scrollbar min-h-0 space-y-3">
                    {panelContent()}
                </div>
            </div>
        </div>
    );
};